// VNQFF-05: Transaction Analysis Client
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('txnForm');
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const payload = {
                user_id: document.getElementById('userId').value,
                amount: parseFloat(document.getElementById('amount').value),
                beneficiary_id: document.getElementById('beneficiaryId').value,
                device_id: document.getElementById('deviceId').value,
                location: document.getElementById('location').value,
                transaction_type: 'UPI'
            };
            const res = await fetch('/api/analyze', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const data = await res.json();
            document.getElementById('resultBox').innerHTML = `<pre>${JSON.stringify(data, null, 2)}</pre>`;
        });
    }
});
