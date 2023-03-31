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
    let despesas = Array();
    let id = localStorage.getItem('id');

    for (let i = 1; i <= id; i++) {
      let despesa = JSON.parse(localStorage.getItem(i));

      if (despesa === null) {
        continue;
      }
      despesa.id = i;
      despesas.push(despesa);
    }

    return despesas;
  }

  pesquisar(despesa) {
    let despesasFiltradas = Array();
    despesasFiltradas = this.recuperaTodosResgistros();

    if (despesa.ano != '') {
      despesasFiltradas = despesasFiltradas.filter((d) => d.ano == despesa.ano);
    }
    if (despesa.mes != '') {
      despesasFiltradas = despesasFiltradas.filter((d) => d.mes == despesa.mes);
    }
    if (despesa.dia != '') {
      despesasFiltradas = despesasFiltradas.filter((d) => d.dia == despesa.dia);
    }
    if (despesa.tipo != '') {
      despesasFiltradas = despesasFiltradas.filter(
        (d) => d.tipo == despesa.tipo
      );
    }
    if (despesa.descricao != '') {
      despesasFiltradas = despesasFiltradas.filter(
        (d) => d.descricao == despesa.descricao
      );
    }
    if (despesa.valor != '') {
      despesasFiltradas = despesasFiltradas.filter(
        (d) => d.valor == despesa.valor
      );
    }
    return despesasFiltradas;
  }

  exclusaoDespesa(id) {
    localStorage.removeItem(id);
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

    ano.value = '';
    mes.value = '';
    dia.value = '';
    tipo.value = '';
    descricao.value = '';
    valor.value = '';

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

function carregaListaDespesas(despesas = Array(), filtro = false) {
  if (despesas.length == 0 && filtro == false) {
    despesas = db.recuperaTodosResgistros();
  }
  let listaDespesa = document.getElementById('listaDespesa');
  listaDespesa.innerHTML = '';

  despesas.forEach(function (d) {
    let linha = listaDespesa.insertRow();
    linha.insertCell(0).innerHTML = `${d.dia}/${d.mes}/${d.ano}`;

    switch (parseInt(d.tipo)) {
      case 1:
        d.tipo = 'Alimentação';
        break;
      case 2:
        d.tipo = 'Educação';
        break;
      case 3:
        d.tipo = 'Lazer';
        break;
      case 4:
        d.tipo = 'Saúde';
        break;
      case 5:
        d.tipo = 'Transporte';
        break;
    }
    linha.insertCell(1).innerHTML = d.tipo;
    linha.insertCell(2).innerHTML = d.descricao;
    linha.insertCell(3).innerHTML = d.valor;

    let btn = document.createElement('button');
    btn.className = 'btn btn-danger';
    btn.innerHTML = '<i class="fa-regular fa-trash-can"></i>';
    btn.onclick = function () {
      db.exclusaoDespesa(d.id);
      window.location.reload();
    };
    linha.insertCell(4).append(btn);
  });
}

function pesquisaDespesa() {
  let ano = document.getElementById('ano').value;
  let mes = document.getElementById('mes').value;
  let dia = document.getElementById('dia').value;
  let tipo = document.getElementById('tipo').value;
  let descricao = document.getElementById('descricao').value;
  let valor = document.getElementById('valor').value;

  let despesa = new Despesa(ano, mes, dia, tipo, descricao, valor);

  let despesas = db.pesquisar(despesa);

  carregaListaDespesas(despesas, true);
}
