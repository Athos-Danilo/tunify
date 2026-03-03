# 🎵 Tunify

> **"A matemática da sua vibe."**

O **Tunify** é uma plataforma de engenharia musical que estende as capacidades do ecossistema Spotify. Diferente de algoritmos tradicionais, o Tunify utiliza **modelagem matemática de áudio** e **Teoria dos Grafos** para permitir que o usuário construa playlists baseadas em curvas de energia, transições harmônicas e contexto.

---

## Visão Geral Técnica

Este projeto não é apenas um consumidor de API. Ele implementa uma arquitetura de **Microsserviços Monolíticos** focada em performance e tratamento de dados.

### Diferenciais de Engenharia:
* **Mixagem Harmônica (Camelot Wheel):** Implementação de algoritmos de DJing para garantir que a transição entre músicas respeite a tonalidade (Key/Mode), evitando dissonância.
* **Busca Vetorial (Euclidean Distance):** As recomendações são calculadas baseadas na distância matemática entre vetores de áudio (Valência, Energia, Dançabilidade).
* **Estratégia Híbrida de Dados:** Utiliza um *Data Lake* local (PostgreSQL) populado com datasets externos para contornar limitações de Rate Limit da API oficial.
* **Arquitetura Resiliente:** Uso de filas e cache (Redis) para processamento assíncrono de grandes volumes de dados.

---

## Tech Stack

### Backend (Core)
* **Linguagem:** Python 3.12
* **Framework:** FastAPI (ASGI)
* **Dados:** Pandas, NumPy, Scikit-learn
* **Banco de Dados:** PostgreSQL & Redis
* **Segurança:** OAuth2 com Rotação de Refresh Tokens

### Frontend (Interface)
* **Framework:** Angular 17+
* **Linguagem:** TypeScript
* **Estilização:** Angular Material & SCSS
* **Gerenciamento de Estado:** RxJS (Reactive Extensions)

---

## Funcionalidades Principais

1. **Vibe Architect:** Crie playlists desenhando uma "Curva de Energia" (ex: Começar Calmo -> Terminar Agitado).
2. **Smart Context:** Geração de playlists baseadas em clima (Weather API) e hora do dia.
3. **Deep Discovery:** Algoritmo focado em encontrar artistas "Lado B" (baixa popularidade) que possuem assinatura sonora idêntica aos seus artistas favoritos.
4. **Dashboard Analítico:** Visualização de dados (Radar Charts) do perfil de consumo do usuário.

---

## Licença

Copyright (c) 2026 Athos Inácio

All Rights Reserved.

Este projeto e seu código-fonte são propriedade exclusiva do autor.

Não é concedida permissão para usar, copiar, modificar, distribuir, sublicenciar ou vender qualquer parte deste software sem autorização prévia e por escrito.

O projeto é disponibilizado publicamente apenas para fins de portfólio e visualização técnica.

---

**Desenvolvido por ATHOS INÁCIO**