document.addEventListener('DOMContentLoaded', function() {
  var addItemForm = document.getElementById('addItemForm');
  var itemInput = document.getElementById('itemInput');
  var itemList = document.getElementById('itemList');
  var clearListBtn = document.getElementById('clearListBtn');
  var exportListBtn = document.getElementById('exportListBtn');
  var itemCounterMap = {};

  function loadItemsFromLocalStorage() {
    var savedItems = localStorage.getItem('itemList');
    if (savedItems) {
      itemCounterMap = JSON.parse(savedItems);
      Object.keys(itemCounterMap).forEach(function(itemText) {
        addItemToList(itemText, itemCounterMap[itemText]);
      });
    }
  }

  function saveItemsToLocalStorage() {
    localStorage.setItem('itemList', JSON.stringify(itemCounterMap));
  }

  function addItemToList(itemText, count) {
    var newItem = document.createElement('li');
    newItem.textContent = itemText + ' (' + count + ')';
    newItem.dataset.item = itemText;
    newItem.appendChild(createEditButton());
    newItem.appendChild(createDeleteButton());
    itemList.appendChild(newItem);
  }

  function createEditButton() {
    var editButton = document.createElement('button');
    editButton.textContent = 'Editar';
    editButton.classList.add('edit-btn');
    editButton.addEventListener('click', function(event) {
      var itemText = event.target.parentNode.dataset.item;
      var newCount = prompt('Digite a nova quantidade para "' + itemText + '":', itemCounterMap[itemText]);
      if (newCount !== null) {
        newCount = parseInt(newCount);
        if (!isNaN(newCount)) {
          itemCounterMap[itemText] = newCount;
          updateItemText(itemText, newCount);
          saveItemsToLocalStorage();
        } else {
          alert('Por favor, insira um número válido.');
        }
      }
    });
    return editButton;
  }

  function createDeleteButton() {
    var deleteButton = document.createElement('button');
    deleteButton.textContent = 'Excluir';
    deleteButton.classList.add('delete-btn');
    deleteButton.addEventListener('click', function(event) {
      var itemText = event.target.parentNode.dataset.item;
      if (confirm('Tem certeza de que deseja excluir "' + itemText + '" da lista?')) {
        deleteItem(itemText);
      }
    });
    return deleteButton;
  }

  function updateItemText(itemText, count) {
    var listItem = itemList.querySelector('li[data-item="' + itemText + '"]');
    listItem.textContent = itemText + ' (' + count + ')';
    listItem.appendChild(createEditButton());
    listItem.appendChild(createDeleteButton());
  }

  function updateItemCounter(itemText) {
    if (itemCounterMap[itemText]) {
      itemCounterMap[itemText]++;
      updateItemText(itemText, itemCounterMap[itemText]);
    } else {
      itemCounterMap[itemText] = 1;
      addItemToList(itemText, 1);
    }
  }

  function deleteItem(itemText) {
    delete itemCounterMap[itemText];
    var listItem = itemList.querySelector('li[data-item="' + itemText + '"]');
    listItem.remove();
    saveItemsToLocalStorage();
  }

  function clearList() {
    if (confirm('Tem certeza de que deseja limpar a lista? Esta ação não pode ser desfeita.')) {
      itemList.innerHTML = '';
      itemCounterMap = {};
      saveItemsToLocalStorage();
    }
  }

  function exportListToTextFile() {
    var itemsText = '';
    Object.keys(itemCounterMap).forEach(function(itemText) {
      itemsText += itemText + ' (' + itemCounterMap[itemText] + ')\n';
    });

    var blob = new Blob([itemsText], { type: 'text/plain' });
    var url = URL.createObjectURL(blob);

    var a = document.createElement('a');
    a.href = url;
    a.download = 'lista_de_itens.txt';
    a.click();
    URL.revokeObjectURL(url);
  }

  loadItemsFromLocalStorage();

  addItemForm.addEventListener('submit', function(event) {
    event.preventDefault();

    var newItemText = itemInput.value.trim();

    if (newItemText !== '') {
      updateItemCounter(newItemText);
      saveItemsToLocalStorage();
      itemInput.value = '';
    }
  });

  clearListBtn.addEventListener('click', function() {
    clearList();
  });

  exportListBtn.addEventListener('click', function() {
    exportListToTextFile();
  });
});
