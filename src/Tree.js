import React from "react";
import {
  Typography,
  Box,
  OutlinedInput,
  Menu,
  MenuItem
} from "@material-ui/core";
import TreeView from "@material-ui/lab/TreeView";
import TreeItem from "@material-ui/lab/TreeItem";
import ArrowDropDown from "@material-ui/icons/ArrowDropDown";
import ArrowRight from "@material-ui/icons/ArrowRight";

import "./styles.css";

export default class Tree extends React.Component {
  constructor() {
    super();
    this.state = {
      data: {
        name: "Earth",
        type: "directory",
        children: [
          {
            name: "Asia",
            type: "directory",
            children: [
              {
                name: "India",
                type: "file"
              },
              {
                name: "China",
                type: "file"
              },
              {
                name: "Japan",
                type: "file"
              },
              {
                name: "South Korea",
                type: "file"
              },
              {
                name: "U.A.E",
                type: "file"
              },
              {
                name: "Jordan",
                type: "file"
              }
            ]
          },
          {
            name: "Americas",
            type: "directory",
            children: [
              {
                name: "USA",
                type: "file"
              },
              {
                name: "Canada",
                type: "file"
              },
              {
                name: "Brazil",
                type: "file"
              },
              {
                name: "Mexico",
                type: "file"
              },
              {
                name: "Chile",
                type: "file"
              }
            ]
          },
          {
            name: "Europe",
            type: "directory",
            children: [
              {
                name: "France",
                type: "file"
              },
              {
                name: "United Kingdom",
                type: "file"
              },
              {
                name: "Germany",
                type: "file"
              },
              {
                name: "Russia",
                type: "file"
              },
              {
                name: "Turkey",
                type: "file"
              },
              {
                name: "Sweden",
                type: "file"
              }
            ]
          },
          {
            name: "Africa",
            type: "directory",
            children: [
              {
                name: "Egypt",
                type: "file"
              },
              {
                name: "South Africa",
                type: "file"
              },
              {
                name: "Morocco",
                type: "file"
              },
              {
                name: "Nideria",
                type: "file"
              },
              {
                name: "Ghana",
                type: "file"
              },
              {
                name: "Ivory Coast",
                type: "file"
              }
            ]
          },
          {
            name: "Australia",
            type: "directory"
          },
          {
            name: "Antartica",
            type: "directory"
          }
        ]
      },
      activeItemId: null,
      rename: false,
      contextMenuPosition: null,
      value: "",
      deleteDialogProps: null,
      isDirectory: null
    };
  }

  textChange = event => {
    this.setState({ value: event.target.value });
  };

  keyPress = (event, path) => {
    var { data, value } = this.state;
    if (event.keyCode === 13) {
      if (value) {
        var i = 1;
        const pathArray = path.split("/");

        data.children.forEach(function iter(a) {
          if (i === pathArray.length - 1) {
            if (a.name === pathArray[i]) {
              a.name = value;
            }
          } else {
            if (a.name === pathArray[i]) {
              i += 1;
              a.children.forEach(iter);
            }
          }
        });
      }
      event.target.blur();
    }
    if (event.keyCode === 27) {
      event.persist();
      event.target.blur();
    }
  };

  toggleRename = () => {
    if (!this.state.rename) {
      this.hideContextMenu();
      setTimeout(() => {
        this.setState({ rename: true });
      }, 500);
    } else {
      this.setState({ rename: false, value: "" }, () => {
        this.setState({ activeItemId: null, isDirectory: null });
      });
    }
  };

  showContextMenu = (event, path, type) => {
    const xPos = event.clientX;
    const yPos = event.clientY;
    if (type !== "directory") {
      this.setState({ activeItemId: path }, () => {
        this.setState({ contextMenuPosition: { x: xPos, y: yPos } });
      });
    }
  };

  hideContextMenu = () => {
    this.setState({ contextMenuPosition: null, isDirectory: null });
  };

  deleteObject = () => {
    var { data, activeItemId } = this.state;
    var i = 1;
    const pathArray = activeItemId.split("/");

    data.children.forEach(function del(a) {
      if (a.name === pathArray[i]) {
        i += 1;
        if (i === pathArray.length - 1) {
          a.children.splice(
            a.children.findIndex(item => item.name === pathArray[i]),
            1
          );
        } else {
          a.children.forEach(del);
        }
      }
    });

    this.setState({
      deleteDialogProps: null,
      activeItemId: null,
      contextMenuPosition: null,
      isDirectory: null
    });
  };

  render() {
    const {
      data,
      activeItemId,
      rename,
      contextMenuPosition,
      value,
      isDirectory
    } = this.state;

    const customLabel = (data, path) => {
      if (rename) {
        return (
          <Box display="flex">
            {path !== activeItemId && <Typography>{data.name}</Typography>}

            {path === activeItemId && (
              <OutlinedInput
                margin="dense"
                autoFocus
                placeholder={data.name}
                value={value}
                fullWidth
                variant="outlined"
                onChange={event => {
                  this.textChange(event);
                }}
                onFocus={event => {
                  event.stopPropagation();
                  event.preventDefault();
                }}
                onBlur={event => {
                  this.toggleRename();
                  event.stopPropagation();
                }}
                onKeyDown={event => {
                  this.keyPress(event, path);
                  event.stopPropagation();
                }}
              />
            )}
          </Box>
        );
      }
    };

    const TreeRender = (data, filePath) => {
      var path;
      if (!filePath) {
        path = `${data.name}`;
      } else {
        path = `${filePath}/${data.name}`;
      }

      const isChildren = data.children && data.children.length > 0;
      if (!rename) {
        if (isChildren) {
          return (
            <TreeItem
              key={path}
              nodeId={path}
              label={<Typography>{data.name}</Typography>}
              onContextMenu={event => {
                this.showContextMenu(event, path, data.type);
                event.stopPropagation();
                event.preventDefault();
              }}
            >
              {data.children.map((node, index) => TreeRender(node, path))}
            </TreeItem>
          );
        }
        return (
          <TreeItem
            key={path}
            nodeId={path}
            label={<Typography>{data.name}</Typography>}
            onContextMenu={event => {
              this.showContextMenu(event, path, data.type);
              event.stopPropagation();
              event.preventDefault();
            }}
          />
        );
      } else {
        if (isChildren) {
          return (
            <TreeItem key={path} nodeId={path} label={customLabel(data, path)}>
              {data.children.map((node, index) => TreeRender(node, path))}
            </TreeItem>
          );
        }
        return (
          <TreeItem key={path} nodeId={path} label={customLabel(data, path)} />
        );
      }
    };
    return (
      <div>
        <TreeView
          defaultCollapseIcon={<ArrowDropDown />}
          defaultExpandIcon={<ArrowRight />}
        >
          {TreeRender(data)}
        </TreeView>

        {contextMenuPosition && (
          <Menu
            id="edit-menu"
            anchorReference="anchorPosition"
            anchorPosition={{
              top: contextMenuPosition ? contextMenuPosition.y : 10,
              left: contextMenuPosition ? contextMenuPosition.x : 10
            }}
            open={Boolean(contextMenuPosition && contextMenuPosition.x > 0)}
            onClose={this.hideContextMenu}
          >
            {activeItemId && (
              <div>
                <MenuItem
                  onClick={event => {
                    this.toggleRename();
                    event.stopPropagation();
                    event.preventDefault();
                  }}
                >
                  <Typography>Rename</Typography>
                </MenuItem>
                <MenuItem
                  disabled={isDirectory}
                  onClick={() => this.deleteObject()}
                >
                  <Typography>Delete</Typography>
                </MenuItem>
              </div>
            )}
          </Menu>
        )}
      </div>
    );
  }
}
