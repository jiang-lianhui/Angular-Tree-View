import { Component, OnInit, Input } from '@angular/core';
import { NestedTreeControl } from '@angular/cdk/tree';
import { MatTreeNestedDataSource } from '@angular/material/tree';

@Component({
  selector: 'app-tree',
  templateUrl: './tree.component.html',
  styleUrls: ['./tree.component.css']
})
export class TreeComponent implements OnInit {

  @Input() public height: number;
  public searchtext: string = '';
  public result: string = '';

  treeControl = new NestedTreeControl<any>(node => node.children);
  fromDataSource = new MatTreeNestedDataSource<any>();
  toDataSource = new MatTreeNestedDataSource<any>();
  selectedTree = new MatTreeNestedDataSource<any>();

  constructor() {
    this.fromDataSource.data = this.FROM_DATA;
  }

  ngOnInit() {}

  addToList() {
    let temp = JSON.parse(JSON.stringify(this.fromDataSource.data)), filtered = [];
    console.log(temp);
    for (let i = 0; i < temp.length; i++) {
      this.removeUnselected(temp[i]);
      if (temp[i].children.length !== 0) {
        filtered.push(temp[i]);
      }
    }
    this.toDataSource.data = JSON.parse(JSON.stringify(filtered));
  }

  removeUnselected(root) {
    if (root.selected === true) {
      root.selected = false;
      return;
    }

    if ("children" in root) {
      let children = root.children;
      let len = children.length;
      var newChildren = [];
      for (let i = 0; i < len; i++) {
        let child = children[i];
        if ("children" in child) {
          // this is not a leaf
          if (child.selected === true) {
            child.selected = false;
            newChildren.push(child);
          }
          else {
            this.removeUnselected(child);
            if (child.children.length !== 0) {
              child.selected == false;
              newChildren.push(child);
            }
          }
        }
        else {
          //this is a leaf
          if (child.selected === true) {
            child.selected = false;
            newChildren.push(child);
          }
        }
      }
      root.children = newChildren;
    }
  }

  removeToList() {
    let temp = JSON.parse(JSON.stringify(this.toDataSource.data)), filtered = [];
    for (let i = 0; i < temp.length; i++) {
      if (temp[i].selected === true)
        continue;

      this.removeSelected(temp[i]);
      if (temp[i].children.length !== 0) {
        filtered.push(temp[i]);
      }
    }
    this.toDataSource.data = JSON.parse(JSON.stringify(filtered));
  }

  removeSelected(root) {
    if ("children" in root) {
      let children = root.children;
      let len = children.length;
      var newChildren = [];
      for (let i = 0; i < len; i++) {
        let child = children[i];
        if ("children" in child) {
          // this is not a leaf
          if (child.selected === true)
            continue;

          else {
            this.removeSelected(child);
            if (child.children.length !== 0) {
              newChildren.push(child);
            }
          }
        }
        else {
          //this is a leaf
          if (child.selected !== true) {
            newChildren.push(child);
          }
        }
      }
      root.children = newChildren;
    }
  }

  selectChildNodeFrom(node: any) {
    setTimeout(() => {
      this.fromDataSource.data = this.selectChild(node, this.fromDataSource.data);
    }, 0);
  }

  selectChildNodeTo(event: any, node: any) {
    setTimeout(() => {
      this.toDataSource.data = this.selectChild(node, this.toDataSource.data);
    }, 0);
  }

  selectChild(node, data) {
    if (node.selected === false) {
      node.selected = true;
      if ('children' in node) {
        this.selectChildren(node, true);
      }
    } else if (node.selected === true) {
      node.selected = false;
      if ('children' in node) {
        this.selectChildren(node, false);
      }
      for (let i=0; i<data.length; i++) {
        if (this.unSelectParent(data[i], node) === true) {
          break;
        }
      }
      console.log(data);
    } else {
      node.selected = true;
      if ('children' in node) {
        this.selectChildren(node, true);
      }
    }
    return data;
  }

  unSelectParent(parentNode, node) {
    if (parentNode.name === node.name) {
      parentNode.selected = false;
      return true;
    }
    if ('children' in parentNode) {
      for (let i=0; i<parentNode.children.length; i++) {
        if (this.unSelectParent(parentNode.children[i], node)) {
          parentNode.selected = false;
          return true;
        }
      }
    }
    return false;
  }

  selectChildren(root, state: boolean) {
      for (let i=0; i<root.children.length; i++) {
        let node = root.children[i];
        node.selected = state;
        if ('children' in node) {
          this.selectChildren(node, state);
        }
      }
  }

  searchTree(event: KeyboardEvent) {
    let temp = JSON.parse(JSON.stringify(this.fromDataSource.data));

    for (let i = 0; i < temp.length; i++) {
      let node = temp[i];
      if (node.children.length !== 0) {
        this.searchNode(node);
      }
      if (node.name.toLowerCase().match(this.searchtext.toLowerCase())) {
        node.searched = true;
      } else {
        node.searched = false;
      }
      if (this.searchtext === '' || this.searchtext === null) {
        node.searched = false;
      }
    }
    this.fromDataSource.data = JSON.parse(JSON.stringify(temp));
    console.log(this.fromDataSource.data)
  }

  searchNode(root) {
    if ("children" in root) {
      let children = root.children;
      let len = children.length;
      for (let i = 0; i < len; i++) {
        let child = children[i];
        if ("children" in child) {
          // this is not a leaf
          this.searchNode(child);
        }
        if (child.name.toLowerCase().match(this.searchtext.toLowerCase())) {
          child.searched = true;
        } else {
          child.searched = false;
        }
        if (this.searchtext === '' || this.searchtext === null) {
          child.searched = false;
        }
      }
    }
  }

  showToList() {
    let temp = JSON.parse(JSON.stringify(this.toDataSource.data));
    this.result = 'Selected Items: ';

    for (let i = 0; i < temp.length; i++) {
      if (temp[i].children.length !== 0) {
        this.showNodeName(temp[i]);
      } else {
        this.result += temp[i].name + ', ';
      }
    }
    this.result = this.result.substring(0, this.result.length-2);
  }

  showNodeName(root) {
    if ('children' in root) {
      let children = root.children;
      let len = children.length;
      for (let i = 0; i < len; i++) {
        if ('children' in children[i]) {
          this.showNodeName(children[i]);
        } else {
          this.result += children[i].name + ', ';
        }
      }
    } else {
      this.result += root.name + ', ';
    }
  }

  hasChild = (_: number, node: any) => !!node.children && node.children.length > 0;

  FROM_DATA = [
    {
      name: 'Fruit',
      children: [
        {
          name: 'Apple',
          children: [
            {name: 'A'}
          ]
        },
        {name: 'Banana'},
        {name: 'Fruit loops'},
      ]
    }, {
      name: 'Vegetables',
      children: [
        {
          name: 'Green',
          children: [
            {name: 'Broccoli'},
            {name: 'Brussel sprouts'},
          ]
        }, {
          name: 'Orange',
          children: [
            {name: 'Pumpkins'},
            {name: 'Carrots'},
          ]
        },
      ]
    },
  ];
}
