(function(){
	function ready(fn){ document.readyState !== 'loading' ? fn() : document.addEventListener('DOMContentLoaded', fn); }

	function decodeJwtResponse(token){
		const base64Url = token.split('.')[1];
		const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
		const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
			return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
		}).join(''));
		return JSON.parse(jsonPayload);
	}

	window.handleGoogleResponse = function(response){
		try{
			const data = decodeJwtResponse(response.credential);
			const profile = { name: data.name, email: data.email, picture: data.picture, sub: data.sub, provider: 'google' };
			localStorage.setItem('user', JSON.stringify(profile));
			updateUI();
		}catch(e){ console.error(e); }
	};

	function signOut(){
		if (window.google && window.google.accounts && window.google.accounts.id) {
			google.accounts.id.disableAutoSelect();
		}
		localStorage.removeItem('user');
		updateUI();
	}

	function updateUI(){
		const userRaw = localStorage.getItem('user');
		const user = userRaw ? JSON.parse(userRaw) : null;
		const welcome = document.getElementById('welcomeUser');
		const signOutBtn = document.getElementById('signOutBtn');
		const profileLink = document.getElementById('profileLink');
		if (user) {
			if (welcome) welcome.textContent = `Signed in as ${user.name} (${user.email})`;
			if (signOutBtn) signOutBtn.style.display = 'inline-flex';
			if (profileLink) profileLink.style.display = 'inline-flex';
		} else {
			if (welcome) welcome.textContent = '';
			if (signOutBtn) signOutBtn.style.display = 'none';
			if (profileLink) profileLink.style.display = 'none';
		}
	}

	function openModal(){
		const modal = document.getElementById('signinModal');
		if (modal) modal.setAttribute('aria-hidden', 'false');
	}
	function closeModal(){
		const modal = document.getElementById('signinModal');
		if (modal) modal.setAttribute('aria-hidden', 'true');
	}

	function emailSignInOrUp(isSignUp){
		const email = (document.getElementById('emailInput') || {}).value || '';
		const password = (document.getElementById('passwordInput') || {}).value || '';
		if (!email || !password) { alert('Please enter email and password'); return; }
		const name = email.split('@')[0];
		const profile = { name, email, provider: isSignUp ? 'local-signup' : 'local' };
		localStorage.setItem('user', JSON.stringify(profile));
		updateUI();
		closeModal();
	}

	ready(function(){
		const openBtn = document.getElementById('openSignIn');
		const closeBackdrop = document.getElementById('closeSignIn');
		const closeBtn = document.getElementById('closeSignInBtn');
		const signOutBtn = document.getElementById('signOutBtn');
		const emailSignInBtn = document.getElementById('emailSignInBtn');
		const emailSignUpBtn = document.getElementById('emailSignUpBtn');

		if (openBtn) openBtn.addEventListener('click', openModal);
		if (closeBackdrop) closeBackdrop.addEventListener('click', closeModal);
		if (closeBtn) closeBtn.addEventListener('click', closeModal);
		if (signOutBtn) signOutBtn.addEventListener('click', signOut);
		if (emailSignInBtn) emailSignInBtn.addEventListener('click', function(){ emailSignInOrUp(false); });
		if (emailSignUpBtn) emailSignUpBtn.addEventListener('click', function(){ emailSignInOrUp(true); });

		updateUI();
	});
})(); 