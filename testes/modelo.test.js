const bd = require('../bd/bd_utils.js');
const modelo = require('../modelo.js');

beforeEach(() => {
  bd.reconfig('./bd/esmforum-teste.db');
  // limpa dados de todas as tabelas
  bd.exec('delete from perguntas', []);
  bd.exec('delete from respostas', []);
});

test('Testando banco de dados vazio', () => {
  expect(modelo.listar_perguntas().length).toBe(0);
});

test('Testando cadastro de três perguntas', () => {
  modelo.cadastrar_pergunta('1 + 1 = ?');
  modelo.cadastrar_pergunta('2 + 2 = ?');
  modelo.cadastrar_pergunta('3 + 3 = ?');
  const perguntas = modelo.listar_perguntas(); 
  expect(perguntas.length).toBe(3);
  expect(perguntas[0].texto).toBe('1 + 1 = ?');
  expect(perguntas[1].texto).toBe('2 + 2 = ?');
  expect(perguntas[2].num_respostas).toBe(0);
  expect(perguntas[1].id_pergunta).toBe(perguntas[2].id_pergunta-1);
});

test('Testando cadastro de pergunta e verificando ID retornado', () => {
  const id = modelo.cadastrar_pergunta('Qual a capital da França?');
  expect(id).toBeGreaterThan(0);
});

test('Testando cadastro de resposta e verificando ID retornado', () => {
  const id_pergunta = modelo.cadastrar_pergunta('Qual a capital da França?');
  const id_resposta = modelo.cadastrar_resposta(id_pergunta, 'Paris');
  expect(id_resposta).toBeGreaterThan(0);
});

test('Testando get_pergunta', () => {
  const id = modelo.cadastrar_pergunta('Qual a capital da França?');
  const pergunta = modelo.get_pergunta(id);
  expect(pergunta.texto).toBe('Qual a capital da França?');
  expect(pergunta.id_usuario).toBe(1);
});

test('Testando get_respostas', () => {
  const id_pergunta = modelo.cadastrar_pergunta('Qual a capital da França?');
  modelo.cadastrar_resposta(id_pergunta, 'Paris');
  const respostas = modelo.get_respostas(id_pergunta);
  expect(respostas.length).toBe(1);
  expect(respostas[0].texto).toBe('Paris');
});

