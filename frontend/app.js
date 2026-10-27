const API_BASE = window.API_BASE_URL || '';
/*const API_BASE = window.API_BASE_URL || 'http://localhost:8000';*/
const form = document.querySelector('#bio-form');
const status = document.querySelector('#form-status');
const recentList = document.querySelector('#recent-list');

function showStatus(message, type = '') {
  status.textContent = message;
  status.className = `form-status ${type}`;
}

function renderProfiles(profiles) {
  if (!profiles.length) {
    recentList.innerHTML = '<p class="empty-state">No profiles have been added yet.</p>';
    return;
  }
  recentList.innerHTML = profiles.slice(0, 6).map((profile) => `
    <article class="recent-card">
      <strong>${escapeHtml(profile.full_name)}</strong>
      <small>${escapeHtml(profile.occupation || 'Profile')} · ${escapeHtml(profile.city || profile.country || 'Location not set')}</small>
    </article>`).join('');
}

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>'"]/g, (character) => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#039;','"':'&quot;'}[character]));
}

async function loadProfiles() {
  try {
    const response = await fetch(`${API_BASE}/api/v1/people`);
    if (!response.ok) throw new Error('Unable to load profiles');
    renderProfiles(await response.json());
  } catch {
    recentList.innerHTML = '<p class="empty-state">Connect the API to see recent profiles.</p>';
  }
}

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  const button = form.querySelector('button[type="submit"]');
  const data = Object.fromEntries(new FormData(form));
  ['height_cm', 'weight_kg'].forEach((key) => { if (data[key]) data[key] = Number(data[key]); else delete data[key]; });
  Object.keys(data).forEach((key) => { if (!data[key]) delete data[key]; });
  button.disabled = true;
  showStatus('Saving profile...');
  try {
    const response = await fetch(`${API_BASE}/api/v1/people`, { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(data) });
    const result = await response.json();
    if (!response.ok) throw new Error(result.detail || 'Could not save this profile');
    form.reset();
    showStatus('Profile saved to the registry.', 'success');
    await loadProfiles();
  } catch (error) {
    showStatus(error.message || 'Something went wrong. Please try again.', 'error');
  } finally { button.disabled = false; }
});

document.querySelector('#refresh-button').addEventListener('click', loadProfiles);
loadProfiles();
