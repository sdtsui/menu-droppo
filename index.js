const Component = require('react').Component
const h = require('react-hyperscript')
const inherits = require('util').inherits
const Raphael = require('raphael')
const findDOMNode = require('react-dom').findDOMNode
const ReactCSSTransitionGroup = require('react-addons-css-transition-group')

module.exports = MenuDroppoComponent


inherits(MenuDroppoComponent, Component)
function MenuDroppoComponent() {
  Component.call(this)
}

MenuDroppoComponent.prototype.render = function() {

  const speed = this.props.speed || '300ms'
  const zIndex = ('zIndex' in this.props) ? this.props.zIndex : 0

  this.manageListeners()

  let style = this.props.style || {}
  if (!('position' in style)) {
    style.position = 'fixed'
  }
  style.zIndex = zIndex


  return (
    h('.menu-droppo-container', {
      style,
    }, [
      h('style', `
        .menu-droppo-enter {
          transition: transform ${speed} ease-in-out;
          transform: translateY(-100%);
        }

        .menu-droppo-enter.menu-droppo-enter-active {
          transition: transform ${speed} ease-in-out;
          transform: translateY(0%);
        }

        .menu-droppo-leave {
          transition: transform ${speed} ease-in-out;
          transform: translateY(0%);
        }

        .menu-droppo-leave.menu-droppo-leave-active {
          transition: transform ${speed} ease-in-out;
          transform: translateY(-100%);
        }
      `),

      h(ReactCSSTransitionGroup, {
        className: 'css-transition-group',
        transitionName: 'menu-droppo',
        transitionEnterTimeout: parseInt(speed),
        transitionLeaveTimeout: parseInt(speed),
      }, this.renderPrimary())
    ])
  )
}

MenuDroppoComponent.prototype.renderPrimary = function() {
  const isOpen = this.props.isOpen
  if (!isOpen) {
    return null
    return h('span', {
      key: 'menu-droppo-null',
      style: {
        height: '0px',
      }
    })
  }

  let innerStyle = this.props.innerStyle || {}

  return (
    h('.menu-droppo', {
      key: 'menu-droppo-drawer',
      style: innerStyle,
    },
    [ this.props.children ])
  )
}

MenuDroppoComponent.prototype.manageListeners = function() {
  const isOpen = this.props.isOpen
  const onClickOutside = this.props.onClickOutside

  if (isOpen) {
    this.outsideClickHandler = onClickOutside
  } else if (isOpen) {
    this.outsideClickHandler = null
  }
}

MenuDroppoComponent.prototype.componentDidMount = function() {
  if (this) {
    this.windowClickHandler = this.windowWasClicked.bind(this);
    window.addEventListener('click', this.windowClickHandler)
    var container = findDOMNode(this)
    this.container = container
  }
}

MenuDroppoComponent.prototype.componentWillUnmount = function() {
  window.removeEventListener('click', this.windowClickHandler)
}

MenuDroppoComponent.prototype.windowWasClicked = function(event) {
  const target = event.target
  const container = findDOMNode(this)
  const isOpen = this.props.isOpen

  if (target !== container &&
     !isDescendant(this.container, event.target) &&
     this.outsideClickHandler) {
     this.outsideClickHandler(event)
  }
}

function isDescendant(parent, child) {
   var node = child.parentNode;
   while (node != null) {
     if (node == parent) {
       return true;
     }
     node = node.parentNode;
   }
   return false;
}

