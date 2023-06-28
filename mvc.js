class Model {
    constructor() {
      this.conts = JSON.parse(localStorage.getItem('conts')) || []
    }
  
    bindContListChanged(callback) {
      this.onContListChanged = callback
    }
  
    _commit(conts) {
      this.onContListChanged(conts)
      localStorage.setItem('conts', JSON.stringify(conts))
    }
  
    addCont(contName, contPhone) {
      const cont = {
        id: this.conts.length > 0 ? this.conts[this.conts.length - 1].id + 2 : 1,
        name: contName,
        phone: contPhone,
      }
  
      this.conts.push(cont)
  
      this._commit(this.conts)
    }
  
    editCont(id, updatedName) {
      this.conts = this.conts.map(cont =>
        cont.id === id ? { id: cont.id, name: updatedName} : cont
      )
  
      this._commit(this.conts)
    }
  
    deleteCont(id) {
      this.conts = this.conts.filter(cont => cont.id !== id)
  
      this._commit(this.conts)
    }
  }

  class View {
    constructor() {
      this.app = this.getElement('#root')
      this.form = this.createElement('form')
      this.name = this.createElement('input')
      this.name.type = 'text'
      this.name.placeholder = 'Add contact'
      this.name.name = 'contName'
      this.phone = this.createElement('input')
      this.phone.type = 'text'
      this.phone.placeholder = 'Add phone'
      this.phone.name = 'contPhone'
      this.submitButton = this.createElement('button')
      this.submitButton.textContent = 'Submit'
      this.form.append(this.name, this.phone, this.submitButton)
      this.title = this.createElement('h1')
      this.title.textContent = 'Contacts'
      this.contList = this.createElement('ul', 'cont-list')
      this.app.append(this.title, this.form, this.contList)
  
      this._temporaryContName = ''
      this._temporaryContPhone = ''
      this._initLocalListeners()
      
    }
  
    get _contName() {
      return this.name.value
    }

    get _contPhone() {
        return this.phone.value
      }
  
    _resetInput() {
      this.name.value = ''
      this.phone.value = ''
    }
  
    createElement(tag, className, classPhone) {
      const element = document.createElement(tag)
  
      if (className) element.classList.add(className)
      if (classPhone) element.classList.add(classPhone)
      return element
    }
  
    getElement(selector) {
      const element = document.querySelector(selector)
  
      return element
    }
  
    displayConts(conts) {
      while (this.contList.firstChild) {
        this.contList.removeChild(this.contList.firstChild)
      }
        conts.forEach(cont => {
          const li = this.createElement('li')
          li.id = cont.id
  
          const nspan = this.createElement('span')
          nspan.contentEditable = true
          nspan.classList.add('editable')
          nspan.textContent = cont.name

          const pspan = this.createElement('span')
          pspan.contentEditable = true
          pspan.classList.add('editable')
          pspan.textContent = cont.phone
        
          const deleteButton = this.createElement('button', 'delete')
          deleteButton.textContent = 'Delete'
          li.append(nspan, pspan, deleteButton)
  

          this.contList.append(li)
        })
        conts.sort((a, b) => a.name > b.name ? 1 : -1);
      console.log(conts)
    }
  
    _initLocalListeners() {
      this.contList.addEventListener('input', event => {
        if (event.target.className === 'editable') {
          this._temporaryContName = event.target.innerText
        }
        if (event.target.classPhone === 'editable') {
            this._temporaryContPhone = event.target.innerText
          }
      })
    }
  
    bindAddCont(handler) {
      this.form.addEventListener('submit', event => {
        event.preventDefault()
  
        if (this._contName && this._contPhone) {
          handler(this._contName, this._contPhone)
          this._resetInput()
        }
        location.reload();
      })
    }
  
    bindDeleteCont(handler) {
      this.contList.addEventListener('click', event => {
        if (event.target.className === 'delete') {
          const id = parseInt(event.target.parentElement.id)
  
          handler(id)
        }
        if (event.target.classPhone === 'delete') {
            const id = parseInt(event.target.parentElement.id)
    
            handler(id)
          }
      })
    }
  
    bindEditCont(handler) {
      this.contList.addEventListener('focusout', event => {
        if (this._temporaryContName && this._temporaryContPhone) {
          const id = parseInt(event.target.parentElement.id)
  
          handler(id, this._temporaryContName, this._temporaryContPhone)
          this._temporaryContName = ''
          this._temporaryContPhone = ''
        }
      })
    }
  
  }
  
class Controller {
    constructor(model, view) {
      this.model = model
      this.view = view
  
      this.model.bindContListChanged(this.onContListChanged)
      this.view.bindAddCont(this.handleAddCont)
      this.view.bindEditCont(this.handleEditCont)
      this.view.bindDeleteCont(this.handleDeleteCont)
  
      this.onContListChanged(this.model.conts)
    }
  
    onContListChanged = conts => {
      this.view.displayConts(conts)
    }
  
    handleAddCont = (contName, contPhone) => {
      this.model.addCont(contName, contPhone)
    }
  
    handleEditCont = (id, contName, contPhone) => {
      this.model.editCont(id, contName, contPhone)
    }
  
    handleDeleteCont = id => {
      this.model.deleteCont(id)
    }

  }
  
  const app = new Controller(new Model(), new View())
 