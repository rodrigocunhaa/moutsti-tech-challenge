let productSequence = 0;

function buildProduct() {
  productSequence += 1;

  return {
    nome: `Test Product ${Date.now()}-${productSequence}`,
    preco: 100,
    descricao: 'Product created by the automated test',
    quantidade: 10,
  };
}

module.exports = { buildProduct };
