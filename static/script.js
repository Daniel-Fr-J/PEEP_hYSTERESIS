document.addEventListener("DOMContentLoaded", function () {
  const range = document.getElementById("ciclos");
  const indicator = document.getElementById("indicator");
  const display = document.getElementById("cycle-display");

  if (range && indicator && display) {
    range.oninput = function () {
      const val = parseInt(this.value);
      const angle = (val / 100) * 270 - 135;
      indicator.style.transform = `translateX(-40%) rotate(${angle}deg)`;
      display.textContent = val;
    };
  }

  const peepSlider = document.getElementById("peep");
  if (peepSlider) {
    peepSlider.oninput = function () {
      document.getElementById("peep-value").textContent = this.value;
    };
  }

  document.getElementById("csvInput")?.addEventListener("change", function (event) {
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
});
