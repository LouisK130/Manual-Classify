// Listeners and logic for area selection
var mouseX1;
var mouseY1;
window.addEventListener('mousedown', function(event) {
	var ele = event.target || event.srcElement;
	if (!(ele == document.body ||
		ele.classList.contains('IFCBTarget') ||
		ele.classList.contains('IFCBImg') ||
		ele.id == 'IFCBTargetContainer')) {
		return;
	}
	mouseX1 = event.clientX;
	mouseY1 = event.clientY;
	var box = document.createElement('div');
	box.id = 'MCSelectAreaBox';
	box.style.outlineStyle = 'solid';
	box.style.outlineWidth = '1px';
	box.style.outlineColor = 'red';
	box.style.position = 'fixed';
	box.style.left = mouseX1 + 'px';
	box.style.top = mouseY1 + 'px';
	box.style.backgroundColor = 'rgba(0,0,0,.5)';
	document.body.appendChild(box);
});

window.addEventListener('mousemove', function(event) {
	if (mouseX1) { // means mouse is down
		var box = document.getElementById('MCSelectAreaBox');
		if (event.clientX < mouseX1) {
			box.style.left = event.clientX + 'px';
			box.style.width = mouseX1 - event.clientX;
		}
		else {
			box.style.width = event.clientX - mouseX1;
		}
		if (event.clientY < mouseY1) {
			box.style.top = event.clientY + 'px';
			box.style.height = mouseY1 - event.clientY;
		}
		else {
			box.style.height = event.clientY - mouseY1;
		}
	}
});

window.addEventListener('mouseup', function(event) {
	var targets = document.getElementsByClassName('IFCBTarget');
	var box = document.getElementById('MCSelectAreaBox');
	for(var n = 0; n < targets.length; n++) {
		var target = targets.item(n);
		if (isClippedByBox(target, box)) {
			var pid = target.id.replace('IFCBTarget_', '');
			var filter = document.getElementById('IFCBClassificationSelection').value;
			var val = document.getElementById('ClassificationApplicationSelection').value;
			var verify_other = false;
			for(var i = 0; i < current_targets.length; i++) {
				if (current_targets[i]['pid'] == pid && 'other_classifications' in current_targets[i]) {
					for(var z = 0; z < current_targets[i]['other_classifications'].length; z++) {
						var c = current_targets[i]['other_classifications'][z]
						if (c['classification_id'] == val) {
							if (user_id == c['user_id']) {
								verify_other = c['classification_id'];
							}
						}
					}
				}
			}
			var label = document.getElementById('IFCBNewClassification_' + pid)
			if (val == '') {
				delete classification_updates[pid];
				label.innerHTML = '';
			}
			else {
				classification_updates[pid] = val;
				label.style.color = 'red';
				target.style.outlineColor = 'black';
				if (val == filter)
					label.innerHTML = '<small><b>VERIFIED</b></small>';
				else if (verify_other)
					label.innerHTML = '<small><b>VERIFIED: ' + verify_other + '</b></small>';
				else
					label.innerHTML = '<b>' + val + '</b>';
			}
			updateAppliedCounter();
		}
	}
	mouseX1 = null;
	mouseY1 = null;
	if (box)
		box.outerHTML = '';
});