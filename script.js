const supabase = supabase.createClient(
  "https://gbnkhgeuvsgmkgymskzz.supabase.co",
  "sb_publishable_WvjRolb7u5JiK3EcfrzABg_CaCo3O5X"
);

// 👉 ENVIO DE DADOS
async function enviarDados() {

  const nome = document.getElementById("nome").value;
  const area = document.getElementById("area").value;
  const interesse = document.getElementById("interesse").value;
  const lgpd = document.getElementById("lgpd").checked;

  if (!nome || !area || !interesse) {
    alert("Preencha todos os campos");
    return;
  }

  if (!lgpd) {
    alert("Você precisa aceitar os termos");
    return;
  }

  const { error } = await supabase
    .from("membros")
    .insert([
      {
        nome,
        area_atuacao: area,
        area_interesse: interesse
      }
    ]);

  if (error) {
    alert("Erro ao salvar");
    return;
  }

  // 👉 abre WhatsApp
  const numero = "5551999999999";

  const mensagem = encodeURIComponent(
    `Olá! Quero entrar no Fórum.\n\nNome: ${nome}\nÁrea: ${area}\nInteresse: ${interesse}`
  );

  window.open(`https://wa.me/${numero}?text=${mensagem}`, "_blank");
}


// 👉 TOTAL
async function carregarTotal() {
  const { data } = await supabase
    .from("membros")
    .select("*");

  document.getElementById("total").innerText = data.length;
}


// 👉 INTERESSES
async function carregarInteresses() {
  const { data } = await supabase
    .from("membros")
    .select("area_interesse");

  const contagem = {};

  data.forEach(item => {
    contagem[item.area_interesse] =
      (contagem[item.area_interesse] || 0) + 1;
  });

  const lista = document.getElementById("lista");

  Object.entries(contagem)
    .sort((a,b) => b[1] - a[1])
    .forEach(([key, value]) => {
      const li = document.createElement("li");
      li.innerText = `${key} (${value})`;
      lista.appendChild(li);
    });
}