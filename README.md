# AgilStore - Gerenciamento de Produtos

Sistema simples para gerenciar o inventário de produtos da loja AgilStore.

## Funcionalidades

- Adicionar novos produtos
- Listar todos os produtos
- Atualizar informações de produtos
- Excluir produtos
- Buscar produtos por ID ou nome
- Dados salvos automaticamente em arquivo JSON

## Requisitos

- Node.js (versão 12 ou superior)

## Como usar

1. Clone o repositório:
```bash
git clone https://github.com/mayasrl/agilstore.git
cd agilstore
```

2. Execute a aplicação:
```bash
npm start
```

Ou diretamente:
```bash
node inventory.js
```

## Operações

**Adicionar Produto**: Insira nome, categoria, quantidade e preço. O ID é gerado automaticamente.

**Listar Produtos**: Visualiza todos os produtos cadastrados em formato de tabela.

**Atualizar Produto**: Escolha o ID do produto e qual campo deseja modificar.

**Excluir Produto**: Remove um produto após confirmação.

**Buscar Produto**: Encontra produtos por ID ou nome (busca parcial).

## Estrutura dos Dados

Cada produto contém:
- ID (gerado automaticamente)
- Nome
- Categoria
- Quantidade em estoque
- Preço

Os dados são salvos em `products.json`.

## Tecnologias

- Node.js
- Módulos nativos: readline, fs
