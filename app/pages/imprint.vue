<script setup lang="ts">
import ShowUnderline from '@/components/animations/ShowUnderline.vue'

// TODO: Page not working correctly on mobile - fix it

// Composables
const { t } = useI18n()
</script>

<template>
  <main class="content-wrapper">
    <Card>
      <template #title>
        <div class="flex flex-col items-center gap-4">
          <div class="relative inline-block">
            <ShowUnderline color="text-purple-400">
              <h1 class="font-great-vibes text-4xl md:text-6xl drop-shadow-sm">
                {{ t('imprint.header') }}
              </h1>
            </ShowUnderline>
          </div>
        </div>
      </template>
      <template #content>
        <!-- Impressum -->
        <div>
          <h2>Impressum:</h2>
          <h3>Angaben gemäß § 5 TMG</h3>
          <h4>Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV:</h4>
          <p>
            Bastian Jakobs (Webseitenbetreiber)<br>
            Eschmarer Str. 26<br>
            53844 Troisdorf<br>
            E-Mail: bastian.j [at] gmx.net
          </p>

          <h4>Kontakt:</h4>
          <p>
            Lisa Auxel und Marcel Rieken (Brautpaar)<br>
            Pützbungert 24<br>
            53639 Königwinter<br>
            E-Mail: rieken.marcel [at] t-online.de
          </p>

          <h3>Haftungsausschluss (Disclaimer)</h3>
          <h4>Haftung für Inhalte</h4>
          <p>
            Als Diensteanbieter sind wir gemäß § 7 Abs.1 TMG für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich.
            Nach §§ 8 bis 10 TMG sind wir als Diensteanbieter jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde Informationen zu überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige Tätigkeit hinweisen.
            Verpflichtungen zur Entfernung oder Sperrung der Nutzung von Informationen nach den allgemeinen Gesetzen bleiben hiervon unberührt.
            Eine diesbezügliche Haftung ist jedoch erst ab dem Zeitpunkt der Kenntnis einer konkreten Rechtsverletzung möglich.
            Bei Bekanntwerden von entsprechenden Rechtsverletzungen werden wir diese Inhalte umgehend entfernen.
          </p>

          <h4>Haftung für Links</h4>
          <p>
            Unser Angebot enthält Links zu externen Webseiten Dritter, auf deren Inhalte wir keinen Einfluss haben.
            Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen.
            Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der Seiten verantwortlich.
            Die verlinkten Seiten wurden zum Zeitpunkt der Verlinkung auf mögliche Rechtsverstöße überprüft.
            Rechtswidrige Inhalte waren zum Zeitpunkt der Verlinkung nicht erkennbar.
            Eine permanente inhaltliche Kontrolle der verlinkten Seiten ist jedoch ohne konkrete Anhaltspunkte einer Rechtsverletzung nicht zumutbar.
            Bei Bekanntwerden von Rechtsverletzungen werden wir derartige Links umgehend entfernen.
          </p>

          <h4>Urheberrecht</h4>
          <p>
            Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem deutschen Urheberrecht.
            Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers.
            Downloads und Kopien dieser Seite sind nur für den privaten, nicht kommerziellen Gebrauch gestattet.
            Soweit die Inhalte auf dieser Seite nicht vom Betreiber erstellt wurden, werden die Urheberrechte Dritter beachtet.
            Insbesondere werden Inhalte Dritter als solche gekennzeichnet. Sollten Sie trotzdem auf eine Urheberrechtsverletzung aufmerksam werden, bitten wir um einen entsprechenden Hinweis.
            Bei Bekanntwerden von Rechtsverletzungen werden wir derartige Inhalte umgehend entfernen.
          </p>
        </div>

        <!-- Datenschutzerklärung -->
        <div>
          <h2>Datenschutzerklärung:</h2>
          <h3>1. Datenschutz auf einen Blick</h3>
          <h4>Allgemeine Hinweise</h4>
          <p>
            Die folgenden Hinweise geben einen einfachen Überblick darüber, was mit Ihren personenbezogenen Daten passiert, wenn Sie unsere Website besuchen.
            Personenbezogene Daten sind alle Daten, mit denen Sie persönlich identifiziert werden können.
            Ausführliche Informationen zum Thema Datenschutz entnehmen Sie unserer unter diesem Text aufgeführten Datenschutzerklärung.
          </p>

          <h4>Datenerfassung auf unserer Website</h4>
          <p>
            Wer ist verantwortlich für die Datenerfassung auf dieser Website?<br>
            Die Datenverarbeitung auf dieser Website erfolgt durch den Websitebetreiber.
            Dessen Kontaktdaten können Sie dem Impressum dieser Website entnehmen.
          </p>

          <h4>Wie erfassen wir Ihre Daten?</h4>
          <p>
            Ihre Daten werden zum einen dadurch erhoben, dass Sie uns diese mitteilen.
            Hierbei kann es sich z.B. um Daten handeln, die Sie in ein Kontaktformular eingeben.<br>
            Andere Daten werden automatisch beim Besuch der Website durch unsere IT-Systeme erfasst.
            Das sind vor allem technische Daten (z.B. Internetbrowser, Betriebssystem oder Uhrzeit des Seitenaufrufs).
            Die Erfassung dieser Daten erfolgt automatisch, sobald Sie unsere Website betreten.
          </p>

          <h4>Wofür nutzen wir Ihre Daten?</h4>
          <p>
            Ein Teil der Daten wird erhoben, um eine fehlerfreie Bereitstellung der Website zu gewährleisten.
            Andere Daten können zur Analyse Ihres Nutzerverhaltens verwendet werden.
          </p>

          <h4>Welche Rechte haben Sie bezüglich Ihrer Daten?</h4>
          <p>
            Sie haben jederzeit das Recht unentgeltlich Auskunft über Herkunft, Empfänger und Zweck Ihrer gespeicherten personenbezogenen Daten zu erhalten.
            Sie haben außerdem ein Recht, die Berichtigung, Sperrung oder Löschung dieser Daten zu verlangen.
            Hierzu sowie zu weiteren Fragen zum Thema Datenschutz können Sie sich jederzeit unter der im Impressum angegebenen Adresse an uns wenden.
            Des Weiteren steht Ihnen ein Beschwerderecht bei der zuständigen Aufsichtsbehörde zu.
          </p>

          <h3>2. Allgemeine Hinweise und Pflichtinformationen</h3>
          <h4>Datenschutz</h4>
          <p>
            Die Betreiber dieser Seiten nehmen den Schutz Ihrer persönlichen Daten sehr ernst.
            Wir behandeln Ihre personenbezogenen Daten vertraulich und entsprechend der gesetzlichen Datenschutzvorschriften sowie dieser Datenschutzerklärung.<br>
            Wenn Sie diese Website benutzen, werden verschiedene personenbezogene Daten erhoben.
            Personenbezogene Daten sind Daten, mit denen Sie persönlich identifiziert werden können.
            Die vorliegende Datenschutzerklärung erläutert, welche Daten wir erheben und wofür wir sie nutzen.
            Sie erläutert auch, wie und zu welchem Zweck das geschieht.<br>
            Wir weisen darauf hin, dass die Datenübertragung im Internet (z.B. bei der Kommunikation per E-Mail) Sicherheitslücken aufweisen kann.
            Ein lückenloser Schutz der Daten vor dem Zugriff durch Dritte ist nicht möglich.
          </p>

          <h4>Hinweis zur verantwortlichen Stelle</h4>
          <p>
            Die verantwortliche Stelle für die Datenverarbeitung auf dieser Website ist:<br>
            <br>
            Bastian Jakobs<br>
            Eschmarer Str. 26<br>
            53844 Troisdorf<br>
            E-Mail: bastian.j [at] gmx.net<br>
            <br>
            Verantwortliche Stelle ist die natürliche oder juristische Person, die allein oder gemeinsam mit anderen über die Zwecke und Mittel der Verarbeitung von personenbezogenen Daten (z.B. Namen, E-Mail-Adressen o. Ä.) entscheidet.
          </p>

          <h4>Widerruf Ihrer Einwilligung zur Datenverarbeitung</h4>
          <p>
            Viele Datenverarbeitungsvorgänge sind nur mit Ihrer ausdrücklichen Einwilligung möglich.
            Sie können eine bereits erteilte Einwilligung jederzeit widerrufen.
            Dazu reicht eine formlose Mitteilung per E-Mail an uns.
            Die Rechtmäßigkeit der bis zum Widerruf erfolgten Datenverarbeitung bleibt vom Widerruf unberührt.
          </p>

          <h4>Beschwerderecht bei der zuständigen Aufsichtsbehörde</h4>
          <p>
            Im Falle von Verstößen gegen die DSGVO steht den Betroffenen ein Beschwerderecht bei einer Aufsichtsbehörde, insbesondere in dem Mitgliedstaat ihres gewöhnlichen Aufenthalts, ihres Arbeitsplatzes oder des Orts des mutmaßlichen Verstoßes zu.
            Das Beschwerderecht besteht unbeschadet anderweitiger verwaltungsrechtlicher oder gerichtlicher Rechtsbehelfe.
          </p>

          <h4>Recht auf Datenübertragbarkeit</h4>
          <p>
            Sie haben das Recht, Daten, die wir auf Grundlage Ihrer Einwilligung oder in Erfüllung eines Vertrags automatisiert verarbeiten, an sich oder an einen Dritten in einem gängigen, maschinenlesbaren Format aushändigen zu lassen.
            Sofern Sie die direkte Übertragung der Daten an einen anderen Verantwortlichen verlangen, erfolgt dies nur, soweit es technisch machbar ist.
          </p>

          <h4>SSL- bzw. TLS-Verschlüsselung</h4>
          <p>
            Diese Seite nutzt aus Sicherheitsgründen und zum Schutz der Übertragung vertraulicher Inhalte, wie zum Beispiel Bestellungen oder Anfragen, die Sie an uns als Seitenbetreiber senden, eine SSL-bzw. TLS-Verschlüsselung.
            Eine verschlüsselte Verbindung erkennen Sie daran, dass die Adresszeile des Browsers von "http://" auf "https://" wechselt und an dem Schloss-Symbol in Ihrer Browserzeile.
            Wenn die SSL- bzw. TLS-Verschlüsselung aktiviert ist, können die Daten, die Sie an uns übermitteln, nicht von Dritten mitgelesen werden.
          </p>

          <h4>Auskunft, Sperrung, Löschung</h4>
          <p>
            Sie haben im Rahmen der geltenden gesetzlichen Bestimmungen jederzeit das Recht auf unentgeltliche Auskunft über Ihre gespeicherten personenbezogenen Daten, deren Herkunft und Empfänger und den Zweck der Datenverarbeitung und ggf. ein Recht auf Berichtigung, Sperrung oder Löschung dieser Daten.
            Hierzu sowie zu weiteren Fragen zum Thema personenbezogene Daten können Sie sich jederzeit unter der im Impressum angegebenen Adresse an uns wenden.
          </p>

          <h4>Widerspruch gegen Werbe-Mails</h4>
          <p>
            Der Nutzung von im Rahmen der Impressumspflicht veröffentlichten Kontaktdaten zur Übersendung von nicht ausdrücklich angeforderter Werbung und Informationsmaterialien wird hiermit widersprochen.
            Die Betreiber der Seiten behalten sich ausdrücklich rechtliche Schritte im Falle der unverlangten Zusendung von Werbeinformationen, etwa durch Spam-E-Mails, vor.
          </p>

          <h3>3. Datenerfassung auf unserer Website</h3>
          <h4>Cookies</h4>
          <p>
            Die Internetseiten verwenden teilweise so genannte Cookies.
            Cookies richten auf Ihrem Rechner keinen Schaden an und enthalten keine Viren.
            Cookies dienen dazu, unser Angebot nutzerfreundlicher, effektiver und sicherer zu machen.
            Cookies sind kleine Textdateien, die auf Ihrem Rechner abgelegt werden und die Ihr Browser speichert.
            Cookies bleiben auf Ihrem Endgerät gespeichert, bis Sie diese löschen.
            Diese Cookies ermöglichen es uns, Ihren Browser beim nächsten Besuch wiederzuerkennen.
            Sie können Ihren Browser so einstellen, dass Sie über das Setzen von Cookies informiert werden und Cookies nur im Einzelfall erlauben, die Annahme von Cookies für bestimmte Fälle oder generell ausschließen sowie das automatische Löschen der Cookies beim Schließen des Browser aktivieren.
            Bei der Deaktivierung von Cookies kann die Funktionalität dieser Website eingeschränkt sein.
            Cookies, die zur Durchführung des elektronischen Kommunikationsvorgangs oder zur Bereitstellung bestimmter, von Ihnen erwünschter Funktionen (z.B. Benutzerverwaltung) erforderlich sind, werden auf Grundlage von Art. 6 Abs. 1 lit. f DSGVO gespeichert.
            Der Websitebetreiber hat ein berechtigtes Interesse an der Speicherung von Cookies zur technisch fehlerfreien und optimierten Bereitstellung seiner Dienste.
            Soweit andere Cookies (z.B. Cookies zur Analyse Ihres Surfverhaltens) gespeichert werden, werden diese in dieser Datenschutzerklärung gesondert behandelt.
          </p>

          <h4>Server-Log-Dateien</h4>
          <p>
            Der Provider der Seiten erhebt und speichert automatisch Informationen in so genannten Server-Log-Dateien, die Ihr Browser automatisch an uns übermittelt.<br>
            Dies sind:<br>
            <br>
            - Browsertyp und Browserversion<br>
            - Verwendetes Betriebssystem<br>
            - Referrer URL<br>
            - Hostname des zugreifenden Rechners<br>
            - Uhrzeit der Serveranfrage<br>
            - IP-Adresse<br>
            <br>
            Eine Zusammenführung dieser Daten mit anderen Datenquellen wird nicht vorgenommen.<br>
            Grundlage für die Datenverarbeitung ist Art. 6 Abs. 1 lit. f DSGVO, der die Verarbeitung von Daten zur Erfüllung eines Vertrags oder vorvertraglicher Maßnahmen gestattet.
          </p>

          <h4>Verarbeiten von Daten (Kunden- und Vertragsdaten)</h4>
          <p>
            Wir erheben, verarbeiten und nutzen personenbezogene Daten nur, soweit sie für die Begründung, inhaltliche Ausgestaltung oder Änderung des Rechtsverhältnisses erforderlich sind (Bestandsdaten).
            Dies erfolgt auf Grundlage von Art. 6 Abs. 1 lit. b DSGVO, der die Verarbeitung von Daten zur Erfüllung eines Vertrags oder vorvertraglicher Maßnahmen gestattet.
            Personenbezogene Daten über die Inanspruchnahme unserer Internetseiten (Nutzungsdaten) erheben, verarbeiten und nutzen wir nur, soweit dies erforderlich ist, um dem Nutzer die Inanspruchnahme des Dienstes zu ermöglichen oder abzurechnen.
            Die erhobenen Kundendaten werden nach Abschluss des Auftrags oder Beendigung der Geschäftsbeziehung gelöscht.
            Gesetzliche Aufbewahrungsfristen bleiben unberührt.
          </p>

          <h3>4. Hosting und Content Delivery Networks (CDN)</h3>
          <h4>Hosting durch Vercel</h4>
          <p>
            Unsere Webseite wird bei Vercel gehostet. Anbieter ist die Vercel Inc., 340 S Lemon Ave #4133, Walnut, CA 91789, USA.
            Wenn Sie unsere Webseite besuchen, werden die Daten (z.B. IP-Adressen, Anfragen, Browser-Informationen) auf den Servern von Vercel verarbeitet.
            Weitere Informationen zur Datenverarbeitung durch Vercel finden Sie in der Datenschutzerklärung von Vercel: <a href="https://vercel.com/legal/privacy-policy">https://vercel.com/legal/privacy-policy</a>.<br>
            <br>
            Die Nutzung von Vercel erfolgt im Interesse einer sicheren, schnellen und effizienten Bereitstellung unserer Webseite.
            Dies stellt ein berechtigtes Interesse im Sinne von Art. 6 Abs. 1 lit. f DSGVO dar.
          </p>

          <h3>5. Drittanbieter-Tools und Plugins</h3>
          <h3>Firebase</h3>
          <p>
            Unsere Webseite nutzt Firebase, einen Dienst der Google Inc., 1600 Amphitheatre Parkway, Mountain View, CA 94043, USA.
            Firebase wird für die Authentifizierung und Verwaltung von Nutzern verwendet.
            Firebase bietet eine Vielzahl von Diensten, die eine Echtzeit-Datenbank, Cloud-Speicher, Analytik und mehr umfassen.
            Wenn Sie unsere Webseite nutzen, können Daten wie Ihre IP-Adresse, Anmeldedaten und andere Nutzungsinformationen an Google-Server in den USA übertragen werden.
          </p>

          <h4>Firebase Authentifizierung</h4>
          <p>
            Für die Authentifizierung von Nutzern verwenden wir Firebase Authentication.
            Hierbei werden personenbezogene Daten wie E-Mail-Adressen und Passwörter gespeichert und verarbeitet, um den Anmeldeprozess und die Verwaltung von Benutzerkonten zu ermöglichen.
          </p>

          <h4>Firebase Realtime Database und Firestore</h4>
          <p>
            Wir nutzen auch Firebase Realtime Database und Firestore, um Daten in Echtzeit zu speichern und abzurufen.
            Dies ermöglicht eine schnelle und effiziente Datenverarbeitung und -speicherung.
          </p>

          <h4>Rechtsgrundlage der Datenverarbeitung</h4>
          <p>
            Die Nutzung von Firebase erfolgt im Interesse einer sicheren, schnellen und effizienten Bereitstellung unserer Webseite und der darauf angebotenen Dienste.
            Dies stellt ein berechtigtes Interesse im Sinne von Art. 6 Abs. 1 lit. f DSGVO dar.
            Falls eine Einwilligung zur Datenverarbeitung erforderlich ist, erfolgt diese auf Grundlage von Art. 6 Abs. 1 lit. a DSGVO.
          </p>

          <h4>Datenübermittlung in die USA</h4>
          <p>
            Firebase ist ein Dienst der Google Inc. und kann Daten in die USA übertragen und dort speichern.
            Google ist unter dem EU-US Privacy Shield zertifiziert, wodurch ein angemessenes Datenschutzniveau garantiert wird.<br>
            <br>
            Weitere Informationen zur Datenverarbeitung durch Firebase finden Sie in der Datenschutzerklärung von Google: <a href="https://policies.google.com/privacy">https://policies.google.com/privacy</a>.
          </p>

          <h3>Spotify</h3>
          <p>
            Unsere Webseite bindet Playlists des Musikdienstes Spotify ein. Anbieter ist die Spotify AB, Regeringsgatan 19, SE-111 53 Stockholm, Schweden.
            Beim Aufruf einer Seite mit einem Spotify-Plugin wird eine Verbindung zu den Spotify-Servern hergestellt.
            Dabei wird Spotify mitgeteilt, welche unserer Seiten Sie besucht haben. Zudem erlangt Spotify Ihre IP-Adresse.<br>
            <br>
            Wenn Sie in Ihrem Spotify-Account eingeloggt sind, ermöglichen Sie Spotify, Ihr Surfverhalten direkt Ihrem persönlichen Profil zuzuordnen.
            Dies können Sie verhindern, indem Sie sich aus Ihrem Spotify-Account ausloggen.<br>
            <br>
            Weitere Informationen zur Datenverarbeitung durch Spotify finden Sie in der Datenschutzerklärung von Spotify: <a href="https://www.spotify.com/de/legal/privacy-policy/">https://www.spotify.com/de/legal/privacy-policy/</a>.
          </p>
        </div>
      </template>
    </Card>
  </main>
</template>

<style scoped>
h2 {
    font-size: 1.75rem;
    font-weight: bold;
    margin-top: 2rem;
}

h3 {
    font-size: 1.5rem;
    font-weight: bold;
    margin-top: 1.5rem;
}

h4 {
    font-size: 1.25rem;
    font-weight: bold;
    margin-top: 1rem;
}

p {
    margin-top: 0.5rem;
}

a {
    color: #4C51BF;
}
</style>
