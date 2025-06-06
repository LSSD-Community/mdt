const API_URL = 'https://sheetdb.io/api/v1/o1tr55vq0v5qp';
let fullData = [];

async function fetchArrests() {
    const res = await fetch(API_URL);
    const data = await res.json();
    fullData = data;
    showMenu();
}

function showMenu() {
    document.body.innerHTML = `
      <div class="container mx-auto p-4 flex flex-col items-center justify-center min-h-screen">
        <h1 class="text-3xl font-bold mb-8">Département du Shériff</h1>
        <div class="flex flex-col gap-4 w-full max-w-xs">
          <button id="btn-suspects" class="p-4 bg-blue-600 text-white rounded-xl text-lg font-semibold hover:bg-blue-700">Voir les suspects</button>
          <button id="btn-agents" class="p-4 bg-green-600 text-white rounded-xl text-lg font-semibold hover:bg-green-700">Voir les agents</button>
        </div>
      </div>
    `;
    document.getElementById('btn-suspects').onclick = showSuspectsPage;
    document.getElementById('btn-agents').onclick = showAgentsPage;
}

function showSuspectsPage() {
    document.body.innerHTML = `
      <div class="container mx-auto p-4">
        <button class='mb-4 text-blue-600 hover:underline' id="back-menu-suspects">← Retour au menu</button>
        <h1 class="text-3xl font-bold mb-6">Liste des suspects</h1>
        <div class="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
          <input id="search-suspect" type="text" placeholder="Rechercher par suspect" class="p-2 rounded border border-gray-300 w-full" />
          <input id="search-agent" type="text" placeholder="Rechercher par agent" class="p-2 rounded border border-gray-300 w-full" />
          <input id="search-infraction" type="text" placeholder="Rechercher par infraction" class="p-2 rounded border border-gray-300 w-full" />
          <select id="search-affiliation" class="p-2 rounded border border-gray-300 w-full">
            <option value="">Toutes les affiliations</option>
          </select>
        </div>
        <div id="suspect-list" class="grid grid-cols-1 md:grid-cols-2 gap-4"></div>
      </div>
    `;
    document.getElementById('back-menu-suspects').onclick = showMenu;
    populateAffiliationFilter(fullData);
    const grouped = groupBySuspect(fullData);
    renderSuspects(grouped);

    document.addEventListener('input', suspectsInputHandler);
    document.getElementById('search-affiliation').addEventListener('change', applyFilters);
}

function suspectsInputHandler(e) {
    if (["search-suspect", "search-agent", "search-infraction"].includes(e.target.id)) {
        applyFilters();
    }
}

function populateAffiliationFilter(data) {
    const select = document.getElementById('search-affiliation');
    const affiliationsSet = new Set();
    data.forEach(entry => {
        if (entry["Affiliation"]) {
            entry["Affiliation"].split(',').map(a => a.trim()).forEach(aff => {
                if (aff) affiliationsSet.add(aff);
            });
        }
    });
    select.innerHTML = '<option value="">Toutes les affiliations</option>';
    Array.from(affiliationsSet).sort().forEach(aff => {
        const option = document.createElement('option');
        option.value = aff;
        option.textContent = aff;
        select.appendChild(option);
    });
}

function groupBySuspect(arrests) {
    const suspects = {};
    arrests.forEach(entry => {
        const key = `${entry['Nom du suspect']}|${entry['Prénom du suspect']}|${entry['Date de naissance du suspect']}`;
        if (!suspects[key]) {
            suspects[key] = [];
        }
        suspects[key].push(entry);
    });
    return suspects;
}

function renderSuspects(suspects) {
    const container = document.getElementById('suspect-list');
    container.innerHTML = '';
    Object.entries(suspects).forEach(([key, records]) => {
        const [nom, prenom, dob] = key.split('|');
        const card = document.createElement('div');
        card.className = 'bg-white p-4 rounded-xl shadow cursor-pointer hover:bg-gray-50';
        card.innerHTML = `<h2 class="text-xl font-semibold">${prenom} ${nom}</h2>
                          <p class="text-sm text-gray-600">Né(e) le : ${dob}</p>`;
        card.onclick = () => showSuspectPage(nom, prenom, dob, records);
        container.appendChild(card);
    });
}

function showSuspectPage(nom, prenom, dob, records) {
    document.body.innerHTML = `<div class='container mx-auto p-4'>
        <button class='mb-4 text-blue-600 hover:underline' id="back-suspects-list">← Retour à la liste</button>
        <h1 class='text-3xl font-bold mb-2'>${prenom} ${nom}</h1>
        <p class='mb-4 text-gray-600'>Date de naissance : ${dob}</p>
        <div id="affiliations" class="mb-4 flex flex-wrap gap-2"></div>

        <h2 class='text-2xl font-semibold mt-6 mb-2'>Arrestations</h2>
        <ul class='list-disc pl-5' id='arrest-list'></ul>

        <h2 class='text-2xl font-semibold mt-6 mb-2'>Connu pour</h2>
        <ul class='list-disc pl-5' id='motif-list'></ul>
      </div>`;

    document.getElementById('back-suspects-list').onclick = showSuspectsPage;

    // Affiliation badges
    const affiliationsSet = new Set();
    records.forEach(entry => {
        if (entry["Affiliation"]) {
            entry["Affiliation"].split(',').map(a => a.trim()).forEach(aff => {
                if (aff) affiliationsSet.add(aff);
            });
        }
    });
    const affiliationsDiv = document.getElementById('affiliations');
    affiliationsSet.forEach(aff => {
        const badge = document.createElement('span');
        badge.className = 'inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full font-semibold';
        badge.textContent = aff;
        affiliationsDiv.appendChild(badge);
    });

    const arrestList = document.getElementById('arrest-list');
    const motifsSet = new Set();

    records.forEach((entry, index) => {
        const listItem = document.createElement('li');
        listItem.className = 'cursor-pointer text-blue-600 hover:underline';
        listItem.textContent = `${entry["Date et heure de l'arrestation"]} par ${entry["Prénom de l'agent"]} ${entry["Nom de l'agent"]} (#${entry["Numéro de badge"]})`;
        listItem.onclick = () => showArrestDetails(entry, showSuspectPage.bind(null, nom, prenom, dob, records));
        arrestList.appendChild(listItem);

        ['Motifs d\'arrestation (pleinement réalisé)', 'Motifs d\'arrestation (tentative)', 'Motifs d\'arrestation (complicité)'].forEach(field => {
            entry[field]?.split(',').map(m => m.trim()).forEach(motif => {
                if (motif) motifsSet.add(motif);
            });
        });
    });

    const motifList = document.getElementById('motif-list');
    motifsSet.forEach(motif => {
        const li = document.createElement('li');
        li.textContent = motif;
        motifList.appendChild(li);
    });
}

function showArrestDetails(entry, backCallback) {
    document.body.innerHTML = `<div class='container mx-auto p-4'>
        <button class='mb-4 text-blue-600 hover:underline' id="back-arrest-details">← Retour</button>
        <h1 class='text-3xl font-bold mb-2'>Détails de l'arrestation</h1>
        <p class='text-gray-700 mb-2'>Date : ${entry["Date et heure de l'arrestation"]}</p>
        <p class='text-gray-700 mb-2'>Agent : ${entry["Prénom de l'agent"]} ${entry["Nom de l'agent"]} (#${entry["Numéro de badge"]})</p>
        <p class='text-gray-700 mb-2'>Lieu : ${entry["Lieu de l'arrestation"]}</p>

        <h2 class='text-2xl font-semibold mt-6 mb-2'>Motifs</h2>
        <ul class='list-disc pl-5'>
          ${['Motifs d\'arrestation (pleinement réalisé)', 'Motifs d\'arrestation (tentative)', 'Motifs d\'arrestation (complicité)'].map(field => {
        return entry[field] ? `<li><strong>${field.split('(')[1].replace(')', '')}:</strong> ${entry[field]}</li>` : '';
    }).join('')}
        </ul>
      </div>`;
    document.getElementById('back-arrest-details').onclick = backCallback || showSuspectsPage;
}

function applyFilters() {
    const suspectQuery = document.getElementById('search-suspect').value.toLowerCase();
    const agentQuery = document.getElementById('search-agent').value.toLowerCase();
    const infractionQuery = document.getElementById('search-infraction').value.toLowerCase();
    const affiliationValue = document.getElementById('search-affiliation').value;

    const filtered = fullData.filter(entry => {
        const suspectMatch = `${entry["Nom du suspect"]} ${entry["Prénom du suspect"]}`.toLowerCase().includes(suspectQuery);
        const agentMatch = `${entry["Nom de l'agent"]} ${entry["Prénom de l'agent"]}`.toLowerCase().includes(agentQuery);
        const infractionMatch = (
            (entry["Motifs d'arrestation (pleinement réalisé)"] || '') +
            (entry["Motifs d'arrestation (tentative)"] || '') +
            (entry["Motifs d'arrestation (complicité)"] || '')
        ).toLowerCase().includes(infractionQuery);

        let affiliationMatch = true;
        if (affiliationValue) {
            affiliationMatch = (entry["Affiliation"] || '').split(',').map(a => a.trim()).includes(affiliationValue);
        }

        return suspectMatch && agentMatch && infractionMatch && affiliationMatch;
    });

    const grouped = groupBySuspect(filtered);
    renderSuspects(grouped);
}

// --- AGENTS ---

function showAgentsPage() {
    document.body.innerHTML = `
      <div class="container mx-auto p-4">
        <button class='mb-4 text-blue-600 hover:underline' id="back-menu-agents">← Retour au menu</button>
        <h1 class="text-3xl font-bold mb-6">Liste des agents</h1>
        <div class="mb-6">
          <input id="search-agent-list" type="text" placeholder="Rechercher un agent" class="p-2 rounded border border-gray-300 w-full max-w-md" />
        </div>
        <div id="agent-list" class="grid grid-cols-1 md:grid-cols-2 gap-4"></div>
      </div>
    `;
    document.getElementById('back-menu-agents').onclick = showMenu;
    renderAgentsList(fullData);

    document.getElementById('search-agent-list').addEventListener('input', function() {
        renderAgentsList(fullData, this.value);
    });
}

function groupByAgent(arrests) {
    const agents = {};
    arrests.forEach(entry => {
        const key = `${entry["Numéro de badge"]}|${entry["Nom de l'agent"]}|${entry["Prénom de l'agent"]}`;
        if (!agents[key]) {
            agents[key] = [];
        }
        agents[key].push(entry);
    });
    return agents;
}

function renderAgentsList(data, search = '') {
    const container = document.getElementById('agent-list');
    container.innerHTML = '';
    const grouped = groupByAgent(data);
    Object.entries(grouped).forEach(([key, records]) => {
        const [badge, nom, prenom] = key.split('|');
        const fullName = `${prenom} ${nom}`.toLowerCase();
        if (search && !fullName.includes(search.toLowerCase()) && !badge.includes(search)) return;
        const card = document.createElement('div');
        card.className = 'bg-white p-4 rounded-xl shadow cursor-pointer hover:bg-gray-50';
        card.innerHTML = `<h2 class="text-xl font-semibold">${prenom} ${nom}</h2>
                          <p class="text-sm text-gray-600">Badge #${badge}</p>
                          <p class="text-xs text-gray-500">${records.length} arrestation(s)</p>`;
        card.onclick = () => showAgentPage(badge, nom, prenom, records);
        container.appendChild(card);
    });
}

function showAgentPage(badge, nom, prenom, records) {
    document.body.innerHTML = `
      <div class="container mx-auto p-4">
        <button class='mb-4 text-blue-600 hover:underline' id="back-agents-list">← Retour à la liste</button>
        <h1 class='text-3xl font-bold mb-2'>${prenom} ${nom}</h1>
        <p class='mb-2 text-gray-600'>Numéro de badge : <span class="font-mono">${badge}</span></p>
        <h2 class='text-2xl font-semibold mt-6 mb-2'>Arrestations effectuées</h2>
        <ul class='list-disc pl-5' id='arrest-list-agent'></ul>
      </div>
    `;
    document.getElementById('back-agents-list').onclick = showAgentsPage;

    const arrestList = document.getElementById('arrest-list-agent');
    records.forEach(entry => {
        const listItem = document.createElement('li');
        listItem.className = 'cursor-pointer text-blue-600 hover:underline';
        listItem.textContent = `${entry["Date et heure de l'arrestation"]} : ${entry["Prénom du suspect"]} ${entry["Nom du suspect"]}`;
        listItem.onclick = () => showArrestDetails(entry, showAgentPage.bind(null, badge, nom, prenom, records));
        arrestList.appendChild(listItem);
    });
}

fetchArrests();
