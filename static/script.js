const range = document.getElementById("ciclos");
const indicator = document.getElementById("indicator");
const display = document.getElementById("cycle-display");

range.oninput = function () {
  const val = parseInt(this.value);
  const angle = (val / 100) * 270 - 135;
  indicator.style.transform = `translateX(-40%) rotate(${angle}deg)`;
  display.textContent = val;
};

document.getElementById("peep").oninput = function () {
  document.getElementById("peep-value").textContent = this.value;
};

function simular() {
  const peep = parseFloat(document.getElementById("peep").value);
  const perfil = document.getElementById("perfil").value;

  const volume = [];
  const pressaoInsp = [];
  const pressaoExp = [];

  for (let v = 0; v <= 1; v += 0.05) {
    volume.push(v.toFixed(2));
    pressaoInsp.push((peep + 5 * Math.pow(v, 2)).toFixed(2));
    pressaoExp.push((peep + 5 * v * Math.exp(-3 * v)).toFixed(2));
  }

  const curvaInsp = {
    x: volume,
    y: pressaoInsp,
    mode: 'lines',
    name: 'Inspiração',
    line: { color: 'red', width: 3 }
  };

  const curvaExp = {
    x: volume.slice().reverse(),
    y: pressaoExp.slice().reverse(),
    mode: 'lines',
    name: 'Expiração',
    line: { color: 'blue', width: 3 }
  };

  const layout = {
    title: `Curva de Histerese para PEEP ${peep} cmH2O (${perfil})`,
    xaxis: { title: 'Volume (L)', range: [0, 1] },
    yaxis: { title: 'Pressão (cmH2O)', range: [peep, peep + 6] },
    margin: { t: 50, l: 60, r: 30, b: 60 },
  };

  Plotly.newPlot('grafico', [curvaInsp, curvaExp], layout);
}

function simularPersonalizado() {
  const texto = document.getElementById("dados").value.trim();
  const linhas = texto.split("\n");

  const volume = [];
  const pressao = [];

  for (const linha of linhas) {
    const partes = linha.split(",");
    if (partes.length === 2) {
      const v = parseFloat(partes[0]);
      const p = parseFloat(partes[1]);
      if (!isNaN(v) && !isNaN(p)) {
        volume.push(v);
        pressao.push(p);
      }
    }
  }

  if (volume.length < 2) {
    alert("Insira pelo menos dois pares volume,pressão válidos.");
    return;
  }

  const curva = {
    x: volume,
    y: pressao,
    mode: 'lines+markers',
    name: 'Dados Inseridos',
    line: { color: 'green', width: 3 }
  };

  const layout = {
    title: 'Curva de Histerese com Dados Personalizados',
    xaxis: { title: 'Volume (L)' },
    yaxis: { title: 'Pressão (cmH2O)' },
    margin: { t: 50, l: 60, r: 30, b: 60 },
  };

  Plotly.newPlot('grafico', [curva], layout);
}

document.getElementById("csvInput").addEventListener("change", function (event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (e) {
    const texto = e.target.result;
    const linhas = texto.trim().split("\n");

    const volume = [];
    const pressao = [];

    for (let i = 1; i < linhas.length; i++) {
      const [vStr, pStr] = linhas[i].split(",");
      const v = parseFloat(vStr);
      const p = parseFloat(pStr);
      if (!isNaN(v) && !isNaN(p)) {
        volume.push(v);
        pressao.push(p);
      }
    }

    if (volume.length < 2) {
      alert("Arquivo CSV deve conter pelo menos dois dados válidos.");
      return;
    }

    const curva = {
      x: volume,
      y: pressao,
      mode: 'lines+markers',
      name: 'CSV Importado',
      line: { color: 'orange', width: 3 }
    };

    const layout = {
      title: 'Curva de Histerese com CSV',
      xaxis: { title: 'Volume (L)' },
      yaxis: { title: 'Pressão (cmH2O)' },
      margin: { t: 50, l: 60, r: 30, b: 60 },
    };

    Plotly.newPlot('grafico', [curva], layout);
  };
  reader.readAsText(file);
});
