import Head from 'next/head';

export default function VIP() {
  return (
    <>
      <Head>
        <title>VIP Access | Mercy Blade</title>
      </Head>
      <div style={{ textAlign: 'center', padding: '50px', fontFamily: 'Arial' }}>
        <h1>Unlock VIP Rooms</h1>
        <p>Choose your VIP level for access to 48 rooms + 219 audios</p>

        {/* VIP1 $2 — YOUR CODE */}
        <div style={{ margin: '30px', border: '1px solid #ccc', padding: '20px', borderRadius: '8px' }}>
          <h3>VIP1 - $2/month (12 rooms)</h3>
          <div id="paypal-button-container-P-6B571463RU9430345NEA6TKI"></div>
        </div>

        {/* VIP2 $4 — CREATE IN PAYPAL */}
        <div style={{ margin: '30px', border: '1px solid #ccc', padding: '20px', borderRadius: '8px' }}>
          <h3>VIP2 - $4/month (24 rooms)</h3>
          <div id="paypal-button-container-VIP2"></div>
        </div>

        {/* VIP3 $6 — CREATE IN PAYPAL */}
        <div style={{ margin: '30px', border: '1px solid #ccc', padding: '20px', borderRadius: '8px' }}>
          <h3>VIP3 - $6/month (All 48 rooms)</h3>
          <div id="paypal-button-container-VIP3"></div>
        </div>

        {/* PAYPAL SDK — ONE TIME */}
        <script src="https://www.paypal.com/sdk/js?client-id=AY4pokblXGnByfVdcKXSzQygFWTohuh7mnKBQL6xQCJaBGhQJt_IjsrE3ZcYMMkWIL4j-EQInupoysK8&vault=true&intent=subscription"></script>

        <script>
          // VIP1 BUTTON
          paypal.Buttons({
            style: { shape: 'rect', color: 'silver', layout: 'vertical', label: 'subscribe' },
            createSubscription: function(data, actions) {
              return actions.subscription.create({ plan_id: 'P-6B571463RU9430345NEA6TKI' });
            },
            onApprove: function(data) {
              alert('VIP1 Unlocked! ID: ' + data.subscriptionID);
            }
          }).render('#paypal-button-container-P-6B571463RU9430345NEA6TKI');

          // VIP2 BUTTON (PASTE YOUR CODE HERE AFTER CREATING PLAN)
          // paypal.Buttons({ ... }).render('#paypal-button-container-VIP2');

          // VIP3 BUTTON (PASTE YOUR CODE HERE AFTER CREATING PLAN)
          // paypal.Buttons({ ... }).render('#paypal-button-container-VIP3');
        </script>
      </div>
    </>
  );
}
