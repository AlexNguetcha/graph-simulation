// init global values
const ACTIONS = [
    {
        id: 'ADD',
        name: 'Ajouter un sommet'
    },
    {
        id: 'LINK',
        name: 'Lier des sommets'
    },
    {
        id: 'DELETE',
        name: 'Supprimer un objet'
    }
];
var graph = [];
var nodes = [];
var currentAction = ACTIONS[0];

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

const addNode = (x, y, nodeContainer) => {
    let node = document.createElement('div')
    node.classList = 'graph-node'
    node.style.position = 'absolute'
    node.style.left = x + 'px'
    node.style.top = y + 'px'
    node.setAttribute('data-node-id', getHigherNodeId())
    node.innerHTML = node.getAttribute('data-node-id');
    nodes.push(node)
    console.log(nodes);
    nodeContainer.append(node)
}

const initGraphEventListener = (graphNode) => {
    graphNode.addEventListener('click', (e) => {
        const [add, link, remove] = ACTIONS
        switch (currentAction) {
            case add:

                addNode(e.clientX-30, e.clientY-30, graphNode)
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

