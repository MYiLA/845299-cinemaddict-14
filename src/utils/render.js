import Abstract from '../view/abstract.js';

const RenderPosition = {
  BEFORE_CHILDS: 'beforeсhilds',
  AFTER_CHILDS: 'afterсhilds',
  AFTER_ELEMENT: 'afterelement',
  BEFORE_ELEMENT: 'beforeelement',
};

const render = (container, element, place) => {
  if (container instanceof Abstract) {
    container = container.getElement();
  }

  if (element instanceof Abstract) {
    element = element.getElement();
  }

  switch (place) {
    case RenderPosition.BEFORE_CHILDS:
      container.prepend(element);
      break;
    case RenderPosition.AFTER_CHILDS:
      container.append(element);
      break;
    case RenderPosition.AFTER_ELEMENT:
      container.after(element);
      break;
    case RenderPosition.BEFORE_ELEMENT:
      container.before(element);
      break;
  }
};

const createElement = (template) => {
  const newElement = document.createElement('div');
  newElement.innerHTML = template;

  return newElement.firstElementChild;
};

const remove = (component) => {
  if (component === null) {
    return;
  }

  if (!(component instanceof Abstract)) {
    throw new Error('Can remove only components');
  }

  component.getElement().remove();
  component.removeElement();
};

const replace = (newChild, oldChild) => {
  if (oldChild instanceof Abstract) {
    oldChild = oldChild.getElement();
  }

  if (newChild instanceof Abstract) {
    newChild = newChild.getElement();
  }

  const parent = oldChild.parentElement;

  if (parent === null || oldChild === null || newChild === null) {
    throw new Error('Can\'t replace unexisting elements');
  }

  parent.replaceChild(newChild, oldChild);
};

export {
  RenderPosition,
  render,
  createElement,
  remove,
  replace
};
