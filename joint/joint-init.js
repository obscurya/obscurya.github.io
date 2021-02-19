const graph = new joint.dia.Graph();

const paper = new joint.dia.Paper({
  el: document.getElementById('joint'),
  model: graph,
  width: '100%',
  height: '100%',
  gridSize: 10,
  drawGrid: 'dot',
  background: {
    color: 'transparent',
  },
  defaultLink: new joint.shapes.standard.Link({
    attrs: {
      line: {
        sourceMarker: {
          type: 'circle',
        },
        targetMarker: {
          type: 'circle',
        },
      },
    },
  }),
  validateConnection: (cellViewS, magnetS, cellViewT, magnetT, end, linkView) => {
    // Prevent linking from input ports.
    if (magnetS && magnetS.getAttribute('port-group') === 'left') return false;
    // Prevent linking from output ports to input ports within one element.
    if (cellViewS === cellViewT) return false;

    // Prevent linking to already connected target ports
    const links = graph.getLinks();
    for (let i = 0; i < links.length; i++) {
      const link = links[i];
      if (!magnetT || linkView == link.findView(paper)) {
        continue;
      }
      if (cellViewT.model.id === link.get('target').id && magnetT.getAttribute('port') === link.get('target').port) {
        return false;
      }
    }

    // Prevent linking to input ports.
    return magnetT && magnetT.getAttribute('port-group') === 'left';
  },
  validateMagnet: (cellView, magnet, evt) => {
    // Prevent links from ports that already have a link
    var port = magnet.getAttribute('port');
    var links = graph.getConnectedLinks(cellView.model, { outbound: true });
    var sourcePortLinks = _.filter(links, function (o) {
      return o.get('source').port == port;
    });

    if (sourcePortLinks.length > 0) return false;

    return magnet.getAttribute('magnet') !== 'passive';
  },
  snapLinks: true,
  markAvailable: true,
  linkPinning: false,
});

paper.options.defaultRouter = {
  name: 'manhattan',
  args: {
    padding: 10,
  },
};

joint.elementTools.RotateButton = joint.elementTools.Button.extend({
  name: 'info-button',
  options: {
    markup: [
      {
        tagName: 'circle',
        selector: 'button',
        attributes: {
          r: 7,
          fill: '#001DFF',
          cursor: 'pointer',
        },
      },
      {
        tagName: 'path',
        selector: 'icon',
        attributes: {
          d: 'M -2 4 2 4 M 0 3 0 0 M -2 -1 1 -1 M -1 -4 1 -4',
          fill: 'none',
          stroke: '#FFFFFF',
          'stroke-width': 2,
          'pointer-events': 'none',
        },
      },
    ],
    x: '100%',
    y: '100%',
    offset: {
      x: 0,
      y: 0,
    },
    action: function (evt) {
      console.log(this);
      this.model.rotate(90);
    },
  },
});

/* EVENTS */

paper.on('link:connect', (linkView, evt, cellView, magnet, arrowhead) => {
  const linkViewTools = new joint.dia.ToolsView({
    tools: [
      new joint.linkTools.Vertices(),
      new joint.linkTools.Segments(),
      new joint.linkTools.Remove(),
      // new joint.linkTools.Boundary(),
    ],
  });

  linkView.addTools(linkViewTools);
  linkView.hideTools();
});

paper.on('link:mouseenter', linkView => {
  linkView.showTools();
});

paper.on('link:mouseleave', linkView => {
  linkView.hideTools();
});

paper.on('element:mouseenter', elementView => {
  elementView.showTools();
});

paper.on('element:mouseleave', elementView => {
  elementView.hideTools();
});

/* WORK WITH ACTIVE ELEMENT */

const activeElement = {
  elementView: null,
};

const renderOptions = () => {
  const optionsElement = document.querySelector('.options');
  const spanElement = optionsElement.querySelector('span');

  if (activeElement.elementView) {
    spanElement.textContent = activeElement.elementView.id;
  } else {
    spanElement.textContent = 'null';
  }
};

const highlightElement = elementView => {
  paper.findViewsInArea(paper.getArea()).forEach(cell => {
    cell.unhighlight();
  });

  if (elementView) {
    elementView.highlight();
    activeElement.elementView = elementView;
  } else {
    activeElement.elementView = null;
  }

  renderOptions();
};

paper.on('element:pointerclick', elementView => {
  highlightElement(elementView);
});

paper.on('blank:pointerdown', (evt, x, y) => {
  highlightElement();
});
