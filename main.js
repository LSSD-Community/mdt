    const API_URL = 'https://sheetdb.io/api/v1/o1tr55vq0v5qp';
    let fullData = [];

    async function fetchArrests() {
      const res = await fetch(API_URL);
      const data = await res.json();
      fullData = data;
      populateAffiliationFilter(data);
      const grouped = groupBySuspect(data);
      renderSuspects(grouped);
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
      // Remove all except first option
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
        <button class='mb-4 text-blue-600 hover:underline' onclick='location.reload()'>← Retour à la liste</button>
        <h1 class='text-3xl font-bold mb-2'>${prenom} ${nom}</h1>
        <p class='mb-4 text-gray-600'>Date de naissance : ${dob}</p>
        <div id="affiliations" class="mb-4 flex flex-wrap gap-2"></div>

        <h2 class='text-2xl font-semibold mt-6 mb-2'>Arrestations</h2>
        <ul class='list-disc pl-5' id='arrest-list'></ul>

        <h2 class='text-2xl font-semibold mt-6 mb-2'>Connu pour</h2>
        <ul class='list-disc pl-5' id='motif-list'></ul>
      </div>`;

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
        listItem.onclick = () => showArrestDetails(entry);
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

    function showArrestDetails(entry) {
      document.body.innerHTML = `<div class='container mx-auto p-4'>
        <button class='mb-4 text-blue-600 hover:underline' onclick='location.reload()'>← Retour à la liste</button>
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

    document.addEventListener('input', (e) => {
      if (["search-suspect", "search-agent", "search-infraction"].includes(e.target.id)) {
        applyFilters();
      }
    });

    document.getElementById('search-affiliation').addEventListener('change', applyFilters);

    fetchArrests();
    