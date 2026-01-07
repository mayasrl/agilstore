const fs = require('fs');
const readline = require('readline');

const DATA_FILE = 'products.json';

let products = [];
let nextId = 1;

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function loadProducts() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const data = fs.readFileSync(DATA_FILE, 'utf-8');
      products = JSON.parse(data);
      nextId = Math.max(...products.map(p => p.id), 0) + 1;
    }
  } catch (err) {
    console.log('Aviso: Não foi possível carregar os produtos anteriores.');
  }
}

function saveProducts() {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(products, null, 2));
  } catch (err) {
    console.log('Erro ao salvar os dados.');
  }
}

function question(prompt) {
  return new Promise(resolve => {
    rl.question(prompt, resolve);
  });
}

async function addProduct() {
  console.log('\n=== Adicionar Novo Produto ===\n');
  
  const name = await question('Nome do Produto: ');
  if (!name.trim()) {
    console.log('Erro: Nome não pode estar vazio.\n');
    return;
  }

  const category = await question('Categoria: ');
  if (!category.trim()) {
    console.log('Erro: Categoria não pode estar vazia.\n');
    return;
  }

  const quantityStr = await question('Quantidade em Estoque: ');
  const quantity = parseInt(quantityStr);
  
  if (isNaN(quantity) || quantity < 0) {
    console.log('Erro: Quantidade deve ser um número positivo.\n');
    return;
  }

  const priceStr = await question('Preço: ');
  const price = parseFloat(priceStr);
  
  if (isNaN(price) || price < 0) {
    console.log('Erro: Preço deve ser um número positivo.\n');
    return;
  }

  const product = {
    id: nextId++,
    name: name.trim(),
    category: category.trim(),
    quantity,
    price
  };

  products.push(product);
  saveProducts();
  console.log(`Produto adicionado com sucesso! ID: ${product.id}\n`);
}

function listProducts() {
  if (products.length === 0) {
    console.log('\nNenhum produto cadastrado ainda.\n');
    return;
  }

  console.log('\n=== Lista de Produtos ===\n');
  console.log('ID  | Nome                 | Categoria    | Qtd | Preço');
  console.log('----+----------------------+--------------+-----+----------');

  products.forEach(p => {
    const id = String(p.id).padEnd(3);
    const name = p.name.substring(0, 20).padEnd(20);
    const category = p.category.substring(0, 12).padEnd(12);
    const qty = String(p.quantity).padEnd(3);
    const price = `R$ ${p.price.toFixed(2)}`;
    
    console.log(`${id} | ${name} | ${category} | ${qty} | ${price}`);
  });

  console.log();
}

async function updateProduct() {
  console.log('\n=== Atualizar Produto ===\n');
  
  const idStr = await question('ID do Produto: ');
  const id = parseInt(idStr);

  if (isNaN(id)) {
    console.log('Erro: ID inválido.\n');
    return;
  }

  const product = products.find(p => p.id === id);
  if (!product) {
    console.log('Erro: Produto não encontrado.\n');
    return;
  }

  console.log('\nO que deseja atualizar?');
  console.log('1. Nome');
  console.log('2. Categoria');
  console.log('3. Quantidade');
  console.log('4. Preço');
  console.log('5. Cancelar\n');

  const choice = await question('Opção: ');

  switch (choice) {
    case '1': {
      const newName = await question('Novo nome: ');
      if (newName.trim()) {
        product.name = newName.trim();
        saveProducts();
        console.log('Nome atualizado!\n');
      } else {
        console.log('Cancelado.\n');
      }
      break;
    }

    case '2': {
      const newCategory = await question('Nova categoria: ');
      if (newCategory.trim()) {
        product.category = newCategory.trim();
        saveProducts();
        console.log('Categoria atualizada!\n');
      } else {
        console.log('Cancelado.\n');
      }
      break;
    }

    case '3': {
      const newQuantity = parseInt(await question('Nova quantidade: '));
      if (!isNaN(newQuantity) && newQuantity >= 0) {
        product.quantity = newQuantity;
        saveProducts();
        console.log('Quantidade atualizada!\n');
      } else {
        console.log('Quantidade inválida.\n');
      }
      break;
    }

    case '4': {
      const newPrice = parseFloat(await question('Novo preço: '));
      if (!isNaN(newPrice) && newPrice >= 0) {
        product.price = newPrice;
        saveProducts();
        console.log('Preço atualizado!\n');
      } else {
        console.log('Preço inválido.\n');
      }
      break;
    }

    case '5':
      console.log('Cancelado.\n');
      break;

    default:
      console.log('Opção inválida.\n');
  }
}

async function deleteProduct() {
  console.log('\n=== Excluir Produto ===\n');
  
  const idStr = await question('ID do Produto: ');
  const id = parseInt(idStr);

  if (isNaN(id)) {
    console.log('Erro: ID inválido.\n');
    return;
  }

  const index = products.findIndex(p => p.id === id);
  if (index === -1) {
    console.log('Erro: Produto não encontrado.\n');
    return;
  }

  const product = products[index];
  const confirm = await question(`Tem certeza que quer excluir "${product.name}"? (s/n): `);

  if (confirm.toLowerCase() === 's') {
    products.splice(index, 1);
    saveProducts();
    console.log('Produto excluído.\n');
  } else {
    console.log('Cancelado.\n');
  }
}

async function searchProduct() {
  console.log('\n=== Buscar Produto ===\n');
  
  const searchType = await question('Buscar por (1) ID ou (2) Nome? ');

  let result = [];

  if (searchType === '1') {
    const id = parseInt(await question('ID: '));
    if (!isNaN(id)) {
      result = products.filter(p => p.id === id);
    }
  } else if (searchType === '2') {
    const name = await question('Nome (ou parte dele): ');
    if (name.trim()) {
      result = products.filter(p => 
        p.name.toLowerCase().includes(name.toLowerCase())
      );
    }
  } else {
    console.log('Opção inválida.\n');
    return;
  }

  if (result.length === 0) {
    console.log('Nenhum produto encontrado.\n');
    return;
  }

  console.log('\n--- Resultado ---\n');
  result.forEach(p => {
    console.log(`ID: ${p.id}`);
    console.log(`Nome: ${p.name}`);
    console.log(`Categoria: ${p.category}`);
    console.log(`Quantidade: ${p.quantity}`);
    console.log(`Preço: R$ ${p.price.toFixed(2)}`);
    console.log();
  });
}

async function showMenu() {
  console.log('\n--- AGILSTORE ---');
  console.log('Gerenciamento de Produtos\n');
  console.log('1. Adicionar Produto');
  console.log('2. Listar Produtos');
  console.log('3. Atualizar Produto');
  console.log('4. Excluir Produto');
  console.log('5. Buscar Produto');
  console.log('6. Sair\n');
  
  const choice = await question('Escolha uma opção: ');
  return choice;
}

async function main() {
  loadProducts();

  let running = true;
  while (running) {
    const choice = await showMenu();

    switch (choice) {
      case '1':
        await addProduct();
        break;

      case '2':
        listProducts();
        break;

      case '3':
        await updateProduct();
        break;

      case '4':
        await deleteProduct();
        break;

      case '5':
        await searchProduct();
        break;

      case '6':
        console.log('Até logo!\n');
        running = false;
        break;

      default:
        console.log('Opção inválida. Tente novamente.\n');
    }
  }

  rl.close();
}

main();
