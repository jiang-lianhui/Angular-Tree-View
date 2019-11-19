import { Component, OnInit, Input } from '@angular/core';
import { NestedTreeControl } from '@angular/cdk/tree';
import { MatTreeNestedDataSource } from '@angular/material/tree';

var _ = require('lodash');

@Component({
  selector: 'app-tree',
  templateUrl: './tree.component.html',
  styleUrls: ['./tree.component.css']
})
export class TreeComponent implements OnInit {

  @Input() public height: number;
  public searchtext: string = '';

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
    for (let i = 0; i < temp.length; i++) {
      this.removeUnselected(temp[i]);
      if (temp[i].children.length !== 0) {
        filtered.push(temp[i]);
      }
    }
    this.toDataSource.data = JSON.parse(JSON.stringify(filtered));
  }

  removeUnselected(root) {
    if ("children" in root) {
      let children = root.children;
      let len = children.length;
      var newChildren = [];
      for (let i = 0; i < len; i++) {
        let child = children[i];
        if ("children" in child) {
          // this is not a leaf
          this.removeUnselected(child);
          if (child.children.length !== 0) {
            newChildren.push(child);
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
          this.removeSelected(child);
          if (child.children.length !== 0) {
            newChildren.push(child);
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

  selectChildNode(event: any, node: any) {
    if (node.selected !== undefined) {
      if (node.selected === false) {
        node.selected = true;
        event.srcElement.style.backgroundColor = '#c2c2c2';
      } else {
        node.selected = false;
        event.srcElement.style.backgroundColor = '#ffffff';
      }
    } else {
      node.selected = true;
      event.srcElement.style.backgroundColor = '#c2c2c2';
    }
  }

  searchTree(event: KeyboardEvent) {
    let temp = JSON.parse(JSON.stringify(this.FROM_DATA)), filtered = [];

    for (let i = 0; i < temp.length; i++) {
      this.searchNode(temp[i]);
      if (temp[i].children.length !== 0) {
        filtered.push(temp[i]);
      }
    }
    this.fromDataSource.data = JSON.parse(JSON.stringify(filtered));
  }

  searchNode(root) {
    if ("children" in root) {
      let children = root.children;
      let len = children.length;
      var newChildren = [];
      for (let i = 0; i < len; i++) {
        let child = children[i];
        if ("children" in child) {
          // this is not a leaf
          if (child.name.match(this.searchtext)) {
            newChildren.push(child);
          }
          else {
            this.searchNode(child);
            if (child.children.length !== 0) {
              newChildren.push(child);
            }
          }
        }
        else {
          //this is a leaf
          if (child.name.match(this.searchtext)) {
            newChildren.push(child);
          }
        }
      }
      root.children = newChildren;
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
