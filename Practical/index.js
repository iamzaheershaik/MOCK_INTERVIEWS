document.addEventListener('DOMContentLoaded', () => {
	const itemsBody = document.getElementById('items-body');
	const addItemBtn = document.getElementById('add-item');
	const subtotalEl = document.getElementById('subtotal');
	const taxRateEl = document.getElementById('tax-rate');
	const taxAmountEl = document.getElementById('tax-amount');
	const totalEl = document.getElementById('total');
	const printBtn = document.getElementById('print');

	function formatCurrency(v) {
		return new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD' }).format(v);
	}

	function createCell(tag, content) {
		const el = document.createElement(tag);
		if (typeof content === 'string') el.textContent = content;
		else if (content instanceof Node) el.appendChild(content);
		return el;
	}

	function addItemRow(item = { desc: '', qty: 1, rate: 0 }) {
		const row = document.createElement('tr');

		const idx = itemsBody.children.length + 1;
		row.appendChild(createCell('td', idx));

		const descTd = document.createElement('td');
		const descInput = document.createElement('input');
		descInput.type = 'text';
		descInput.value = item.desc;
		descTd.appendChild(descInput);
		row.appendChild(descTd);

		const qtyTd = document.createElement('td');
		const qtyInput = document.createElement('input');
		qtyInput.type = 'number';
		qtyInput.min = '0';
		qtyInput.step = '1';
		qtyInput.value = item.qty;
		qtyTd.appendChild(qtyInput);
		row.appendChild(qtyTd);

		const rateTd = document.createElement('td');
		const rateInput = document.createElement('input');
		rateInput.type = 'number';
		rateInput.min = '0';
		rateInput.step = '0.01';
		rateInput.value = item.rate;
		rateTd.appendChild(rateInput);
		row.appendChild(rateTd);

		const amountTd = document.createElement('td');
		amountTd.textContent = formatCurrency(0);
		row.appendChild(amountTd);

		const actionsTd = document.createElement('td');
		const removeBtn = document.createElement('button');
		removeBtn.type = 'button';
		removeBtn.textContent = 'Remove';
		actionsTd.appendChild(removeBtn);
		row.appendChild(actionsTd);

		function update() {
			const q = parseFloat(qtyInput.value) || 0;
			const r = parseFloat(rateInput.value) || 0;
			const amt = q * r;
			amountTd.textContent = formatCurrency(amt);
			calculateTotals();
		}

		qtyInput.addEventListener('input', update);
		rateInput.addEventListener('input', update);
		descInput.addEventListener('input', () => {});
		removeBtn.addEventListener('click', () => {
			row.remove();
			refreshIndices();
			calculateTotals();
		});

		itemsBody.appendChild(row);
		update();
	}

	function refreshIndices() {
		Array.from(itemsBody.children).forEach((r, i) => {
			r.children[0].textContent = i + 1;
		});
	}

	function calculateTotals() {
		let subtotal = 0;
		Array.from(itemsBody.children).forEach(r => {
			const qty = parseFloat(r.children[2].firstChild.value) || 0;
			const rate = parseFloat(r.children[3].firstChild.value) || 0;
			subtotal += qty * rate;
		});

		const taxRate = parseFloat(taxRateEl.value) || 0;
		const taxAmount = subtotal * (taxRate / 100);
		const total = subtotal + taxAmount;

		subtotalEl.textContent = formatCurrency(subtotal);
		taxAmountEl.textContent = formatCurrency(taxAmount);
		totalEl.textContent = formatCurrency(total);
	}

	addItemBtn.addEventListener('click', () => addItemRow());
	taxRateEl.addEventListener('input', calculateTotals);
	printBtn.addEventListener('click', () => window.print());

	// Initialize with one empty row
	addItemRow();
});
