class Despesa {
  constructor(ano, mes, dia, tipo, descricao, valor) {
    this.ano = ano;
    this.mes = mes;
    this.dia = dia;
    this.tipo = tipo;
    this.descricao = descricao;
    this.valor = valor;
  }

  validaDados() {
    for (let i in this) {
      if (this[i] == undefined || this[i] == null || this[i] == '') {
        return false;
      }
    }
    return true;
  }
}

class Bd {
  constructor() {
    let id = localStorage.getItem('id');

    if (id === null) {
      localStorage.setItem('id', 0);
    }
  }

  getProximoId() {
    let proximoId = localStorage.getItem('id');
    return parseInt(proximoId) + 1;
  }

  gravar(d) {
    let id = this.getProximoId();

    localStorage.setItem(id, JSON.stringify(d));

    localStorage.setItem('id', id);
  }

  recuperaTodosResgistros() {
    console.log('Teste');
  }
}

let db = new Bd();

function cadastrarDespesa() {
  let ano = document.getElementById('ano');
  let mes = document.getElementById('mes');
  let dia = document.getElementById('dia');
  let tipo = document.getElementById('tipo');
  let descricao = document.getElementById('descricao');
  let valor = document.getElementById('valor');

  // Inicia o objetob
  let despesa = new Despesa(
    ano.value,
    mes.value,
    dia.value,
    tipo.value,
    descricao.value,
    valor.value
  );
  if (despesa.validaDados()) {
    db.gravar(despesa);

    document.getElementById('tituloModal').innerHTML =
      'Registro cadastrado com sucesso!';
    document.getElementById('divTituloModal').className =
      'modal-header text-success';
    document.getElementById('descricaoModal').innerHTML =
      'Despesa cadastrada com sucesso!';
    document.getElementById('buttonModal').className = 'btn btn-success';

    $('#modalRegistraDespesa').modal('show');
  } else {
    document.getElementById('tituloModal').innerHTML =
      'Erro na inclusão de resgistro!';
    document.getElementById('divTituloModal').className =
      'modal-header text-danger';
    document.getElementById('descricaoModal').innerHTML =
      'A campos ainda vazios para serem preenchidos!';
    document.getElementById('buttonModal').className = 'btn btn-danger';

    $('#modalRegistraDespesa').modal('show');
  }
}

function carregaListaDespesas() {
  db.recuperaTodosResgistros();
}
