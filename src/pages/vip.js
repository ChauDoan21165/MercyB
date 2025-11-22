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

        {/* VIP1 $3 */}
        <div style={{ margin: '30px', border: '1px solid #ccc', padding: '20px', borderRadius: '8px' }}>
          <h3>VIP1 - $3/month (12 rooms)</h3>
          <div id="paypal-button-container-P-6B571463RU9430345NEA6TKI"></div>
        </div>

        {/* VIP2 $6 */}
        <div style={{ margin: '30px', border: '1px solid #ccc', padding: '20px', borderRadius: '8px' }}>
          <h3>VIP2 - $6/month (24 rooms)</h3>
          <div id="paypal-button-container-P-9KA72338CS258724TNEA6WYA"></div>
        </div>

        {/* VIP3 $15 */}
        <div style={{ margin: '30px', border: '1px solid #ccc', padding: '20px', borderRadius: '8px' }}>
          <h3>VIP3 - $15/month (All 48 rooms)</h3>
          <div id="paypal-button-container-P-1XY370504K8237930NEA6XKY"></div>
        </div>

        {/* PAYPAL SDK */}
        <script src="https://www.paypal.com/sdk/js?client-id=AY4pokblXGnByfVdcKXSzQygFWTohuh7mnKBQL6xQCJaBGhQJt_IjsrE3ZcYMMkWIL4j-EQInupoysK8&vault=true&intent=subscription"></script>

        <script>
          // VIP1
          paypal.Buttons({
            style: { shape: 'rect', color: 'silver', layout: 'vertical', label: 'subscribe' },
            createSubscription: function(data, actions) {
              return actions.subscription.create({ plan_id: 'P-6B571463RU9430345NEA6TKI' });
            },
            onApprove: function(data) {
              alert('VIP1 Unlocked! ID: ' + data.subscriptionID);
            }
          }).render('#paypal-button-container-P-6B571463RU9430345NEA6TKI');

          // VIP2
          paypal.Buttons({
            style: { shape: 'rect', color: 'blue', layout: 'vertical', label: 'subscribe' },
            createSubscription: function(data, actions) {
              return actions.subscription.create({ plan_id: 'P-9KA72338CS258724TNEA6WYA' });
            },
            onApprove: function(data) {
              alert('VIP2 Unlocked! ID: ' + data.subscriptionID);
            }
          }).render('#paypal-button-container-P-9KA72338CS258724TNEA6WYA');

          // VIP3
          paypal.Buttons({
            style: { shape: 'rect', color: 'gold', layout: 'vertical', label: 'subscribe' },
            createSubscription: function(data, actions) {
              return actions.subscription.create({ plan_id: 'P-1XY370504K8237930NEA6XKY' });
            },
            onApprove: function(data) {
              alert('VIP3 Unlocked! ID: ' + data.subscriptionID);
            }
          }).render('#paypal-button-container-P-1XY370504K8237930NEA6XKY');
        </script>
      </div>
    </>
  );
}
