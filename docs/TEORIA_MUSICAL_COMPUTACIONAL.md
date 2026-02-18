# **Teoria Musical Computacional: Harmonia e Mixagem**

**Projeto:** Tunify

**Módulo:** backend/app/services/camelot.py

**Assunto:** Algoritmo de Mixagem Harmônica (Harmonic Mixing)

**Data da Atualização:** 18/02/2026

---

## **1\. Introdução: O Problema da "Virada Torta"**

No mundo do streaming, a maioria dos algoritmos de "Shuffle" foca apenas no gênero ou no BPM (batidas por minuto). Porém, existe um fator invisível que determina se uma transição entre músicas soa agradável ou se causa desconforto (dissonância) no ouvinte: a **Tonalidade Musical (Musical Key)**.

Tentar mixar uma música em **Dó Maior** com uma em **Fá Sustenido** cria um choque de frequências que o cérebro humano interpreta como "erro" ou "barulho", quebrando o estado de fluxo (flow).

O **Tunify** resolve isso implementando a lógica de **Mixagem Harmônica**, a mesma técnica utilizada por DJs profissionais para criar sets contínuos de 2 horas que parecem uma única música longa.

---

## **2\. A Roda de Camelot (The Camelot Wheel)**

Para simplificar a complexa teoria musical (Círculo de Quintas) para computadores e DJs, utilizamos o sistema **Camelot Wheel**. Ele organiza as 24 tonalidades musicais em um formato de relógio visual.

### **2.1. Como Ler a Roda**

A roda é dividida em dois anéis e 12 "horas":

* **Anel Externo (Letra B):** Representa os acordes **Maiores (Major)**. São músicas com sonoridade alegre, aberta, energética.  
* **Anel Interno (Letra A):** Representa os acordes **Menores (Minor)**. São músicas com sonoridade triste, profunda, emocional ou séria.  
* **Os Números (1 a 12):** Representam a tonalidade base.

### **2.2. Regras de Movimento (O Algoritmo)**

Para o Tunify, uma "transição harmônica válida" significa mover-se na roda apenas **um passo** de cada vez.

Se a música atual está na posição **8B** (Dó Maior), as próximas músicas permitidas são:

1. **Mesma Posição (8B):** Compatibilidade perfeita. Soa como uma continuação.  
2. **Vizinhas de Hora (+1 ou \-1):**  
   * **7B:** Subir energia suavemente.  
   * **9B:** Descer energia suavemente.  
3. **Troca de Anel (Mesma Hora):**  
   * **8A:** Mudança de "Humor" (Mood Change). A música mantém as notas, mas muda de Alegre para Emocional.

**Movimento Proibido:** Cruzar a roda (ex: de 8B para 2B). Isso causa dissonância.

---

## **3\. Tradução: API do Spotify para Camelot**

A API do Spotify não conhece a "Camelot Wheel". Ela devolve dados brutos baseados na teoria musical clássica (Pitch Class Notation). O Backend do Tunify deve atuar como um tradutor.

### **Dados que recebemos da API (Audio Features):**

* **key (int):** Um número de 0 a 11 (0 \= C, 1 \= C\#, 2 \= D...).  
* **mode (int):** 0 ou 1 (0 \= Minor, 1 \= Major).

### **Tabela de Conversão (A Pedra de Roseta)**

| Spotify Key (Pitch) | Key (Nota) | Mode 1 (Major) \-\> Code B | Mode 0 (Minor) \-\> Code A |
| :---- | :---- | :---- | :---- |
| **0** | C (Dó) | **8B** | **5A** |
| **1** | C\# / Db | **3B** | **12A** |
| **2** | D (Ré) | **10B** | **7A** |
| **3** | D\# / Eb | **5B** | **2A** |
| **4** | E (Mi) | **12B** | **9A** |
| **5** | F (Fá) | **7B** | **4A** |
| **6** | F\# / Gb | **2B** | **11A** |
| **7** | G (Sol) | **9B** | **6A** |
| **8** | G\# / Ab | **4B** | **1A** |
| **9** | A (Lá) | **11B** | **8A** |
| **10** | A\# / Bb | **6B** | **3A** |
| **11** | B (Si) | **1B** | **10A** |

---

## **4\. Algoritmos Especiais de Transição**

O Tunify não apenas evita erros, ele cria narrativas. Abaixo estão as lógicas avançadas que implementaremos no módulo de recomendação.

### **4.1. O "Energy Boost" (+2 Semitons)**

DJs usam este truque para levantar a pista de dança instantaneamente. Harmonicamente não é perfeito, mas gera uma injeção de adrenalina.

* **Lógica:** Pular **\+2 números** na roda Camelot (ex: 8B \-\> 10B).  
* **Uso:** Quando o usuário define a curva de energia como "Subida Rápida".

### **4.2. O "Mood Shift" (A Troca de Anel)**

Usado para alterar a emoção sem perder o ritmo.

* **Lógica:** Manter o número, inverter a letra (ex: 8B \-\> 8A).  
* **Uso:** Em transições de playlists baseadas em clima (ex: Começou a chover \-\> troca de Major para Minor).

---

## **5\. Implementação Lógica (Pseudocódigo Python)**

Como o arquivo camelot.py deve processar essa lógica:

Python

\# Dicionário de Mapeamento (Tuple \-\> String)  
SPOTIFY\_TO\_CAMELOT \= {  
    (0, 1): "8B", (0, 0): "5A",  
    (1, 1): "3B", (1, 0): "12A",  
    \# ... (tabela completa acima)  
}

def get\_compatible\_matches(current\_key: int, current\_mode: int, strategy="smooth"):  
    """  
    Retorna a lista de códigos Camelot compatíveis baseada na estratégia.  
    Strategies: 'smooth', 'energy\_boost', 'mood\_shift'  
    """  
    current\_code \= SPOTIFY\_TO\_CAMELOT.get((current\_key, current\_mode))  
    number \= int(current\_code\[:-1\]) \# Pega o '8' de '8B'  
    letter \= current\_code\[-1\]       \# Pega o 'B' de '8B'  
      
    compatible \= \[\]  
      
    if strategy \== "smooth":  
        \# Regra: Mesmo número, \+/- 1, ou troca de letra no mesmo número  
        compatible.append(f"{number}{letter}") \# 8B  
        compatible.append(f"{number if number \< 12 else 1}{letter}") \# 9B (Lidar com o 12 virando 1\)  
        compatible.append(f"{number if number \> 1 else 12}{letter}") \# 7B  
          
        \# Troca de anel  
        other\_letter \= "A" if letter \== "B" else "B"  
        compatible.append(f"{number}{other\_letter}") \# 8A  
          
    return compatible

**Data:** 18/02/2026