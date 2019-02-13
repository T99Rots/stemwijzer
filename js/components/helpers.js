export const where = () => {
  if(page.changed) {
    page.elements.forEach(element => {
      if(element.getAttribute('page') === page.value) {
        element.setAttribute('selected','')
      } else {
        element.removeAttribute('selected')
      }
    });
  }
} 