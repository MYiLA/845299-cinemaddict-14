import Abstract from '../view/abstract.js';

export const RenderPosition = {
  AFTER_CHILDS: 'afterсhilds',
  BEFORE_CHILDS: 'beforeсhilds',
  AFTER_ELEMENT: 'afterelement',
  BEFORE_ELEMENT: 'beforeelement',
};

export const render = (container, child, place) => {
  if (container instanceof Abstract) {
    container = container.getElement();
  }

  if (child instanceof Abstract) {
    child = child.getElement();
  }

  switch (place) {
    case RenderPosition.AFTER_CHILDS:
      container.prepend(child);
      break;
    case RenderPosition.BEFORE_CHILDS:
      container.append(child);
      break;
    case RenderPosition.AFTER_ELEMENT:
      container.after(child);
      break;
    case RenderPosition.BEFORE_ELEMENT:
      container.before(child);
      break;
  }
};

export const createElement = (template) => {
  const newElement = document.createElement('div');
  newElement.innerHTML = template;

  return newElement.firstElementChild;
};

export const remove = (component) => {
  if (!(component instanceof Abstract)) {
    throw new Error('Can remove only components');
  }

  component.getElement().remove();
  component.removeElement();
};

export const replace = (newChild, oldChild) => {
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
