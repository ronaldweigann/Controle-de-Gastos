/* 
Variável - Um pedacinho da memória do computador
que eu guardo o que eu quiser
let 
console.log() - Mostra algo na tela

Função - Pedacinho de código QUE
Só executa QUANDO eu CHAMO ELA

Lógica de Programação - Pensar como computador pensa
Algoritmo - Receita de bolo

[x] Carregar a foto
[x] Falar QUAL FOTO eu vou carregar  
[x] Salva a foto  
[x] Enviar para a IA foto + orientação
[x] Receber a resposta da IA  
[x] Formatar a resposta
[x] Colocar na tela   
[ ] Estilizar a lista
     
document = HTML
querySelector = Selecionar um elemento do HTML
innerHTML = Colocar algo dentro do HTML
*/

let pedido = 'Olhe a foto deste comprovante e responda em UMA linha, sem escrever mais nada, com 2 pedaços separados por |. Primeiro pedaço: o emoji da categoria, o nome do estabelecimento dentro de <strong>, e depois cada item comprado com seu valor, um por linha usando <br>. Segundo pedaço: o total pago, só o número, com ponto e sempre com duas casas decimais. As categorias são: 🛒 Mercado, 🚗 Transporte, 🍔 Comida, 💊 Saúde, 🎉 Lazer, 🏠 Casa, 💸 Outros. Exemplo de resposta: 🍔 <strong>Padaria Pão Quente</strong><br>Pão — R$ 5,00<br>Leite — R$ 4,50|9.50';
let total = 0

let comprovantes = [];

async function lerFoto() {

    let foto = document.querySelector(".foto").files[0];

    let resposta = await puter.ai.chat(pedido, foto);

    let texto = resposta.message.content;

    let partes = texto.split("|");

    console.log(partes);

    // Guardar o comprovante
    comprovantes.push({
        itens: partes[0],
        valor: Number(partes[1])
    });

    // Mostrar na tela
    document.querySelector(".lista").innerHTML += `
        <div class="comprovante">

            <div class="itens">
                ${partes[0]}
            </div>

            <div class="total-nota">
                Total da nota: R$ ${Number(partes[1]).toFixed(2)}
            </div>

        </div>
    `;

    // Somar
    total += Number(partes[1]);

    document.querySelector(".total-gasto").innerHTML =
        "R$ " + total.toFixed(2);
}

function enviarWhatsApp() {

    let telefone = document.querySelector("#telefone").value;

    telefone = telefone.replace(/\D/g, "");

    if (!telefone) {
        alert("Digite seu número de WhatsApp!");
        return;
    }

    if (!telefone.startsWith("55")) {
        telefone = "55" + telefone;
    }

    if (comprovantes.length === 0) {
        alert("Você ainda não adicionou nenhum comprovante!");
        return;
    }

    let mensagem = `🧾 *RELATÓRIO DE GASTOS*\n\n`;

    comprovantes.forEach((comprovante, index) => {

        let itens = comprovante.itens
            .replace(/<strong>/g, "")
            .replace(/<\/strong>/g, "")
            .replace(/<br\s*\/?>/gi, "\n");

        mensagem += `📌 *Comprovante ${index + 1}*\n`;
        mensagem += `${itens}\n`;
        mensagem += `💰 Total: R$ ${comprovante.valor.toFixed(2)}\n\n`;
    });

    mensagem += `━━━━━━━━━━━━━━\n`;
    mensagem += `💵 *TOTAL GERAL: R$ ${total.toFixed(2)}*`;

    const url =
        `https://wa.me/${telefone}?text=${encodeURIComponent(mensagem)}`;

    window.open(url, "_blank");
}