// Importando los modulos = cpdigos hechos por un desarrollador para ser reutilizado en algun programa
import * as Contacts from "./contacts.js"


// Selectores
const inputName = document.querySelector('#name-input');
const inputNumber = document.querySelector('#phone-input');
const form = document.querySelector('#main-form');
const formBtn = document.querySelector('#main-form-btn');
const contactsList = document.querySelector('#contacts-list');

// Expresiones regulares o REGEX
const NAME_REGEX = /^[A-Z][a-z]*[ ][A-Z][a-z]{3,}[ ]{0,1}$/;
const PHONE_REGEX = /^[0](412|424|414|426|416|212)[0-9]{7}$/;

// Validaciones del formulario
let nameValidation = false;
let phoneValidation = false;

// Funciones
const renderValidation = (input, validation) => {
  const helperText = input.nextElementSibling;  
  if (input.value === '') {
    input.classList.remove('input-invalid');
    input.classList.remove('input-valid');
    helperText?.classList.remove('show-helper-text');
  } else if (validation) {
    input.classList.add('input-valid');
    input.classList.remove('input-invalid');
    helperText?.classList.remove('show-helper-text');
  } else {
    input.classList.add('input-invalid');
    input.classList.remove('input-valid');
    helperText?.classList.add('show-helper-text');
  }
}

const renderButtonState = () => {
  if (nameValidation && phoneValidation) {
    formBtn.disabled = false;
  } else {
    formBtn.disabled = true;
  }
}

// Eventos
inputName.addEventListener('input', e => {
  nameValidation = NAME_REGEX.test(inputName.value);
  renderValidation(inputName, nameValidation);
  renderButtonState();
});

inputNumber.addEventListener('input', e => {
  phoneValidation = PHONE_REGEX.test(inputNumber.value);
  renderValidation(inputNumber, phoneValidation);
  renderButtonState();
});

form.addEventListener('submit', e => {
  e.preventDefault();
  // 1. Validar
  if (!nameValidation || !phoneValidation) return;

  // 2. Obtener el numero y el nombre.
  const phone = inputNumber.value;
  const name = inputName.value;

  // 3. Asignar un id. Ramdom
  const id = crypto.randomUUID();

  // 4. Estructurar el contacto
  const newContact = {id, name, phone};

  // 5. Agregar al array de contactos
   Contacts.addContact(newContact);

  // 6. Guardar en el navegador
  Contacts.saveInBrowser();
  
  // 7. Renderizar en el navegador
  Contacts.renderContacts(contactsList);
});

contactsList.addEventListener("click", e => {
  const deleteBtn = e.target.closest(".delete-btn");
  const editBtn = e.target.closest(".edit-btn");



  if (deleteBtn) {
    const li = deleteBtn.parentElement.parentElement;
    const contactInputName = li.children[0].children[0];
    const contactInputPhone = li.children[0].children[1];

    // TAREA
    const isValidName = NAME_REGEX.test(contactInputName.value);
    const isValidPhone = PHONE_REGEX.test(contactInputPhone.value);

    if (!isValidName || !isValidPhone) {
        let errorMessage = "❌ No se puede eliminar porque los datos son inválidos:\n";
        if (!isValidName) errorMessage += "- Formato de nombre inválido\n";
        if (!isValidPhone) errorMessage += "- Formato de teléfono inválido\n";
        alert(errorMessage);
        return; 
    } //TERMINA TAREA

    // Proceder con la eliminación si los datos son válidos
    Contacts.removeContact(li.id);
    Contacts.renderContacts(contactsList);
    Contacts.saveInBrowser();
}

  if (editBtn) {
  // 1. Encuentro el li
  const li = editBtn.parentElement.parentElement;
  // 2. Obtener el status
  const status = li.getAttribute("status");
  // 3. Obtener los inputs
  const contactInputName = li.children[0].children[0];
  const contactInputPhone = li.children[0].children[1];
  // 4. Obtener el boton
  const contactEditBtn = li.children[1].children[0];

  if (status === "inputs-deshabilitados"){
    // 1. Remover el readonly (No se puede editar) de los inputs
    contactInputName.removeAttribute("readonly");
    contactInputPhone.removeAttribute("readonly");
    // 2. Cambiar el status a inputs-habilitados
    li.setAttribute("status", "inputs-habilitados");
    // 3. Cambiar icono del boton para reflejar el estado
    contactEditBtn.innerHTML = Contacts.EditIconEnabled;
    // 4. Cambiar estilos de los inputs para reflejar el estado
      }

      if (status === "inputs-habilitados") {
        // TAREA
        // Validar campos antes de guardar 
        const isValidName = NAME_REGEX.test(contactInputName.value);
        const isValidPhone = PHONE_REGEX.test(contactInputPhone.value);
    
        if (!isValidName || !isValidPhone) {
            let errorMessage = "❗Errores de validación:\n";
            if (!isValidName) errorMessage += "     -Formato de nombre inválido\n";
            if (!isValidPhone) errorMessage += "     -Formato de teléfono inválido\n";
            errorMessage += "\n✅Ejemplos válidos:\nNombre: Carlos Marrero\nTeléfono: 04242123194";
    
            alert(errorMessage);
            return; 
        }// TERMINA TAREA
    
        // 1. Agregar el readonly (No se puede editar) a los inputs
        contactInputName.setAttribute("readonly", true);
        contactInputPhone.setAttribute("readonly", true);   
        // 2. Cambiar el status a inputs-deshabilitados
        li.setAttribute("status", "inputs-deshabilitados");
        // 3. Cambiar icono del botón para reflejar el estado
        contactEditBtn.innerHTML = Contacts.EditIconDisabled;
        // 4. Actualizar el contacto encontrado
        const updatedContact = {
            id: li.id,
            name: contactInputName.value,
            phone: contactInputPhone.value,
        };
        Contacts.updateContact(updatedContact);
        // 5. Guardar en el navegador
        Contacts.saveInBrowser();
        // 6. Mostrar la lista actualizada en el HTML
        Contacts.renderContacts(contactsList);
    
      } 
    }
});

window.onload = () => {
  // 1. Obtener la data de Local Storage
  Contacts.getContactsFromLocalStorage();
  // 2. Renderizar los contactos
  Contacts.renderContacts(contactsList);
}