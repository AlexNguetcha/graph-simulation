// init global values
const ACTIONS = [
    {
        id: 'ADD',
        name: 'Add a node'
    },
    {
        id: 'LINK',
        name: 'Link nodes'
    },
    {
        id: 'DELETE',
        name: 'Delete object'
    }
];
var graph = [];
var nodes = [];
var vertex = [];
var currentAction = ACTIONS[0];
var nodeToLink = null;

const initActions = (actions, actionsNode) => {
    actions.forEach((action, key) => {
        let node = document.createElement('div')
        node.className = 'actionCommand' + ((key == 0) ? ' active' : '');
        node.innerHTML = `${action.name}`
        node.setAttribute('data-action', action.id)
        node.addEventListener('click', (e) => {
            setCurrentAction(action)
        })
        actionsNode.append(node)
    });
}

const setCurrentAction = (action) => {
    currentAction = action;
    document.querySelector('.actionCommand.active').classList.remove('active')
    document.querySelector(`[data-action=${action.id}]`).classList.add('active')
}

const getHigherNodeId = () => {
    if (nodes.length == 0) {
        return 0
    }
    let lastHightNodeId = parseInt(nodes[0].dataset.nodeId)
    nodes.forEach((element, index) => {
        if (lastHightNodeId < parseInt(element.dataset.nodeId)) {
            lastHightNodeId = parseInt(element.dataset.nodeId)
        }
    })
    return lastHightNodeId + 1
}

const removeNode = (node) => {
    nodes = nodes.filter((value, index) => {
        return parseInt(value.dataset.nodeId) != parseInt(node.dataset.nodeId)
    })
    vertex = vertex.filter((value, index)=>{
        if(value.from==node || value.to==node){
            removeVertex(document.getElementById(value.id))
        }
        return !(value.from==node || value.to==node)
    })
    node.remove()
    updateGraph()
}

const removeVertex = (node) => {
    vertex = vertex.filter(({ from, to, weight, id }, index) => {
        return node.getAttribute('id') != id
    })
    node.remove()
    updateGraph()
}

const drawVertex = (container, id, [x1, y1], [x2, y2], weight, color = '#333', thickness = 3) => {
    let length = Math.sqrt(((x2 - x1) * (x2 - x1)) + ((y2 - y1) * (y2 - y1)));
    let cx = ((x1 + x2) / 2) - (length / 2);
    let cy = ((y1 + y2) / 2) - (thickness / 2);
    let angle = Math.atan2((y1 - y2), (x1 - x2)) * (180 / Math.PI);

    var lineNode = document.createElement('div')
    lineNode.id = id
    lineNode.classList = 'vertex'
    lineNode.style.height = thickness + "px";
    lineNode.style.backgroundColor = color;
    lineNode.style.left = cx + "px";
    lineNode.style.top = cy + "px";
    lineNode.style.width = length + "px";
    lineNode.style.transform = `rotate(${angle}deg)`;
    lineNode.style.backgroundColor = color;

    let lineNodeText = document.createElement('div')
    lineNodeText.style.backgroundColor = color;
    lineNodeText.style.transform = `rotate(-${angle * -1}deg)`;
    lineNodeText.style.backgroundColor = color;
    lineNodeText.innerText = weight

    lineNode.append(lineNodeText)
    lineNode.addEventListener('click', () => {
        if (currentAction == ACTIONS[2]) {
            removeVertex(lineNode)
        }
    })
    container.append(lineNode)
    updateGraph()
}

const graphHasVertex = (node1, node2) => {
    let has = false
    vertex.forEach(({ from, to, weight, id }) => {
        if (from == node1 && to == node2) {
            has = true
        }
    });
    return has;
}

const findVertex = (node1, node2)=>{
    let v = null
    vertex.forEach(({ from, to, weight, id }) => {
        if ((from == node1 && to == node2) || (from == node2 && to == node1)) {
            v = { from, to, weight, id }
        }
    });
    return v;
}

const addNode = (x, y, nodeContainer) => {
    let node = document.createElement('div')
    node.classList = 'graph-node'
    node.style.position = 'absolute'
    node.style.left = x + 'px'
    node.style.top = y + 'px'
    node.setAttribute('data-node-id', getHigherNodeId())
    node.innerHTML = node.getAttribute('data-node-id');
    node.addEventListener('click', () => {
        // console.log(`click on node ${node.innerHTML}`);
        if (currentAction == ACTIONS[2]) {
            removeNode(node)
        } else if (currentAction == ACTIONS[1]) {
            if (nodeToLink != null) {
                nodeToLink.style.background = 'var(--green)'
                if (!graphHasVertex(nodeToLink, node)) {
                    // create a vertex
                    let vertexId = (new Date()).getTime()
                    vertex.push({
                        from: nodeToLink,
                        to: node,
                        weight: 2,
                        id: vertexId
                    })

                    drawVertex(
                        document.querySelector('#graph-container'),
                        vertexId,
                        [nodeToLink.style.left, nodeToLink.style.top].map(e => e.replace('px', '')).map(Number).map(e => (e + 30)),
                        [node.style.left, node.style.top].map(e => e.replace('px', '')).map(Number).map(e => (e + 30)),
                        2
                    )
                }
                nodeToLink = null
            } else {
                node.style.background = 'red';
                nodeToLink = node
            }
        }
    })
    nodes.push(node)
    nodeContainer.append(node)
    updateGraph()
}

const updateGraph = () => {
    let newGraph = []
    nodes.forEach(element => {
        let elementRelations = Array(nodes.length).fill(0)
        nodes.forEach((elt, key) => {
            if(graphHasVertex(element, elt) || graphHasVertex(elt, element)){
                elementRelations[key] = findVertex(element, elt).weight
            }
        });
        newGraph.push(elementRelations)
    });
    graph = newGraph
    console.log(graph);
}

const initGraphEventListener = (graphNode) => {
    graphNode.addEventListener('click', (e) => {
        const [add, link, remove] = ACTIONS
        switch (currentAction) {
            case add:
                addNode(e.clientX - 30, e.clientY - 30, graphNode)
                break;
            case link:

                break;
            case remove:

                break;

            default:
                break;
        }
    })
}


initGraphEventListener(document.querySelector('#graph-container'))
initActions(ACTIONS, document.querySelector("#graph-command"))

