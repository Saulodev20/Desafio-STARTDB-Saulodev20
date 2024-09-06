class RecintosZoo {

    constructor() {
      this.recintos = [
        { numero: 1, bioma: 'savana', tamanho: 10, animais: [{ especie: 'macaco', quantidade: 3, tamanho: 1 }] },
        { numero: 2, bioma: 'floresta', tamanho: 5, animais: [] },
        { numero: 3, bioma: 'savana e rio', tamanho: 7, animais: [{ especie: 'gazela', quantidade: 1, tamanho: 2 }] },
        { numero: 4, bioma: 'rio', tamanho: 8, animais: [] },
        { numero: 5, bioma: 'savana', tamanho: 9, animais: [{ especie: 'leão', quantidade: 1, tamanho: 3 }] },
      ];
  
      this.animais = {
        leao: { tamanho: 3, biomas: ['savana'], carnivoro: true },
        leopardo: { tamanho: 2, biomas: ['savana'], carnivoro: true },
        crocodilo: { tamanho: 3, biomas: ['rio'], carnivoro: true },
        macaco: { tamanho: 1, biomas: ['savana', 'floresta'], carnivoro: false },
        gazela: { tamanho: 2, biomas: ['savana'], carnivoro: false },
        hipopotamo: { tamanho: 4, biomas: ['savana', 'rio'], carnivoro: false },
      };
    }
  
    analisaRecintos(animal, quantidade) {
      // Validação para ver o animal é válido
      animal = animal.toLowerCase();
      if (!this.animais[animal]) {
        return { erro: "Animal inválido", recintosViaveis: null };
      }
  
      // Validação da quantidade é válida
      if (quantidade <= 0 || !Number.isInteger(quantidade)) {
        return { erro: "Quantidade inválida", recintosViaveis: null };
      }
  
      const { tamanho, biomas, carnivoro } = this.animais[animal];
      const totalTamanho = quantidade * tamanho;
      let recintosViaveis = [];
  
      this.recintos.forEach(recinto => {
        let espacoDisponivel = recinto.tamanho;
        let biomaAdequado = biomas.includes(recinto.bioma) || recinto.bioma.includes('savana e rio');
  
        // Verificando se o animal no recinto é válido antes de acessar suas propriedades
        let outroCarnivoro = recinto.animais.some(a => 
          this.animais[a.especie.toLowerCase()] && this.animais[a.especie.toLowerCase()].carnivoro && a.especie.toLowerCase() !== animal
        );
        let outroHerbivoro = recinto.animais.some(a => 
          this.animais[a.especie.toLowerCase()] && !this.animais[a.especie.toLowerCase()].carnivoro && a.especie.toLowerCase() !== animal
        );
        let jaPossuiMesmaEspecie = recinto.animais.some(a => a.especie.toLowerCase() === animal);
  
        // Verificando se o bioma é adequado
        if (!biomaAdequado) return;
  
        // Verificando se há outro carnívoro ou herbívoro que não pode conviver
        if (carnivoro && (outroCarnivoro || outroHerbivoro || recinto.animais.length > 0)) return;
        if (!carnivoro && outroCarnivoro) return;
  
        // Verificando se há espaço suficiente, incluindo espaço extra para várias espécies
        recinto.animais.forEach(a => {
          if (this.animais[a.especie.toLowerCase()]) {
            espacoDisponivel -= a.quantidade * this.animais[a.especie.toLowerCase()].tamanho;
          }
        });
  
        if (recinto.animais.length > 0 && !jaPossuiMesmaEspecie) {
          espacoDisponivel -= 1; // Espaço extra para se houver mais de uma espécie
        }
  
        if (espacoDisponivel >= totalTamanho) {
          // Verificando regras específicas do hipopótamo e do macaco
          if (animal === 'hipopotamo' && recinto.bioma !== 'savana e rio') return;
          if (animal === 'macaco' && quantidade === 1 && recinto.animais.length === 0) return;
  
          // Verificado se os animais atuais continuarão confortáveis
          if (recinto.animais.length > 0 && jaPossuiMesmaEspecie) {
            const especieRecinto = recinto.animais.find(a => a.especie.toLowerCase() === animal);
            if (especieRecinto && espacoDisponivel < tamanho) return;
          }
  
          recintosViaveis.push({
            numero: recinto.numero,
            espacoLivre: espacoDisponivel - totalTamanho,
            espacoTotal: recinto.tamanho,
          });
        }
      });
  
      if (recintosViaveis.length === 0) {
        return { erro: "Não há recinto viável", recintosViaveis: null };
      }
  
      // Ordenando os recintos por número
      recintosViaveis.sort((a, b) => a.numero - b.numero);
  
      // Retornando os recintos viáveis
      return { erro: null, recintosViaveis: recintosViaveis.map(r => `Recinto ${r.numero} (espaço livre: ${r.espacoLivre} total: ${r.espacoTotal})`) };
    }
  }
  
  export { RecintosZoo as RecintosZoo };
  