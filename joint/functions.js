const createShape1 = () => {
  const rect = new joint.shapes.standard.Rectangle({
    position: {
      x: 100,
      y: 50,
    },
    size: {
      width: 100,
      height: 50,
    },
    attrs: {
      body: {
        fill: '#fff',
      },
      label: {
        text: 'Shape 1',
        fill: '#000',
      },
    },
    ports: {
      groups: {
        right: {
          position: {
            name: 'right',
          },
          attrs: {
            circle: {
              r: 6,
              magnet: true,
            },
          },
        },
      },
      items: [
        {
          group: 'right',
          args: {
            dy: 10,
          },
        },
      ],
    },
  });

  rect.addTo(graph);

  const rectView = rect.findView(paper);

  highlightElement(rectView);

  // const elementViewTools = new joint.dia.ToolsView({
  //   tools: [
  //     new joint.elementTools.Boundary(),
  //     new joint.elementTools.Remove(),
  //     // new joint.elementTools.RotateButton(),
  //   ],
  // });

  // rectView.addTools(elementViewTools);
  // rectView.hideTools();
};

const createShape2 = () => {
  const rect = new joint.shapes.standard.Rectangle({
    position: {
      x: 100,
      y: 50,
    },
    size: {
      width: 100,
      height: 50,
    },
    attrs: {
      body: {
        fill: 'lightblue',
      },
      label: {
        text: 'Shape 2',
        fill: '#000',
      },
    },
    ports: {
      groups: {
        left: {
          position: {
            name: 'left',
          },
          attrs: {
            circle: {
              r: 6,
              magnet: 'passive',
            },
          },
        },
        right: {
          position: {
            name: 'right',
          },
          attrs: {
            circle: {
              r: 6,
              magnet: true,
            },
          },
        },
      },
      items: [
        {
          group: 'left',
        },
        {
          group: 'left',
        },
        {
          group: 'right',
        },
      ],
    },
  });

  rect.addTo(graph);

  const rectView = rect.findView(paper);

  highlightElement(rectView);

  // const elementViewTools = new joint.dia.ToolsView({
  //   tools: [
  //     new joint.elementTools.Boundary(),
  //     new joint.elementTools.Remove(),
  //     // new joint.elementTools.RotateButton(),
  //   ],
  // });

  // rectView.addTools(elementViewTools);
  // rectView.hideTools();
};

const rotateActiveElement = () => {
  if (!activeElement.elementView) return;

  activeElement.elementView.model.rotate(90);
};

const removeActiveElement = () => {
  if (!activeElement.elementView) return;

  activeElement.elementView.model.remove();
  activeElement.elementView = null;

  renderOptions();
};
