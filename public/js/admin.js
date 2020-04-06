const deleteProduct = (btn)=>{
  const prodId = btn.parentNode.querySelector('[name=productId]').value
  const csrfToken = btn.parentNode.querySelector('[name=_csrf]').value
  const prodElem = btn.closest('article')
  
  console.log(prodId)
  console.log(csrfToken)
  
  fetch(`/admin/products/${prodId}`, {
    credentials: 'include',
    method: 'POST',
    headers: {
      'CSRF-Token': csrfToken
    }
  })
  .then(result =>{
    return result.json()
  })
  .then(data =>{
    prodElem.parentNode.removeChild(prodElem);
  })
  .catch(e=>console.log(e));


};