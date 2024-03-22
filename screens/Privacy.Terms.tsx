import React from "react";
import { StyleSheet } from "react-native";
import { TitleText } from "../components/StyledText";
import { Container, ScrollView, Text, View } from "../components/Themed";
import { theme } from "../constants/Theme";

import { appInfo } from "../app.info";

export function PrivacyTerms() {
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <TitleText style={styles.title}>
          POLÍTICA DE PRIVACIDAD DE COMUNIDAD ALTA
        </TitleText>
        <Text style={styles.body}>
          ATENCIÓN, al aceptar los términos y condiciones, usted permite,
          autoriza y consiente el tratamiento de sus datos personales
          consistentes en: Nombre (s); Apellido(s); fotografías y videos en los
          que usted aparece, dirección de correo electrónico, tipo de conexión a
          internet, datos de uso e Información del dispositivo y fecha de
          nacimiento. Además, al autorizar los términos y condiciones, permite y
          está de acuerdo en que sus Datos Personales puedan transferirse a
          sociedades subsidiarias, filiales, afiliadas, controladoras y/o
          aliadas comerciales, dentro de territorio nacional. Asimismo, acepta
          que sus datos personales sean transmitidos a las personas que a
          continuación se mencionan: asesores en materia legal, contable y/o
          fiscal, autoridades hacendarias y, cualquier otra que lo solicite.
        </Text>
        <Container style={styles.separator} />
        <TitleText style={styles.subtitle}>CLASES DE DATOS RECOGIDOS</TitleText>
        <Text style={styles.body}>
          {`Entre las clases de Datos Personales que recoge esta Aplicación, ya sea directamente o a través de terceros, seencuentran: Nombres; Apellido(s); Dirección de correo electrónico; Tipo de conexión a internet; Datos de uso e Información del dispositivo.
La información completa referente a cada categoría de Datos Personales que se recogen se proporciona en lassecciones de la presente política de privacidad dedicadas a tal fin o mediante textos explicativos específicos que se muestran antes de la recogida de dichos Datos. Los Datos Personales podrán ser proporcionados libremente por el Usuario o, en caso de los Datos de Uso e Información del dispositivo, serán recogidos automáticamente cuando se utilice esta Aplicación.
Todos los Datos solicitados por esta Aplicación son obligatorios y la negativa a proporcionarlos podrá imposibilitar que esta Aplicación pueda proceder a la prestación del Servicio. En los casos en los que esta Aplicación indique específicamente que ciertos Datos no son obligatorios, los Usuarios serán libres de no comunicar tales Datos sin que esto tenga consecuencia alguna sobre la disponibilidad o el funcionamiento del Servicio. Los Usuarios que tengan dudas sobre qué Datos son obligatorios pueden contactar con ${appInfo.name}.
El uso de Cookies - o de otras herramientas de seguimiento - por parte de esta Aplicación o por los titulares deservicios de terceros utilizados por esta Aplicación tiene como finalidad la prestación del Servicio solicitado porel Usuario, además de cualesquiera otras finalidades que se describen en el presente documento y en la Política de Cookies, en caso de estar disponible.
El Usuario asume la responsabilidad respecto de los Datos Personales de terceros que se obtengan, publiquen o compartan a través de esta Aplicación y declara por la presente que tiene el consentimiento de dichos terceros para proporcionar dichos Datos al Titular.`}
        </Text>
        <Container style={styles.separator} />
        <TitleText style={styles.subtitle}>
          MODALIDADES DE TRATAMIENTO
        </TitleText>
        <Text style={styles.body}>
          {`${appInfo.name} tratará los Datos de los Usuarios de manera adecuada y adoptará las medidas de seguridad apropiadas para impedir el acceso, la revelación, alteración o destrucción no autorizados de los Datos.
El tratamiento de datos se realizará mediante ordenadores y/o herramientas informáticas, siguiendo procedimientos y modalidades organizativas estrictamente relacionadas con las finalidades señaladas. Además${appInfo.name}, en algunos casos podrán acceder a los Datos ciertas categorías de personas autorizadas, relacionadas con el funcionamiento de esta Aplicación (administración, ventas, marketing, departamento jurídico y de administración de sistemas) o contratistas externos que presten servicios al Titular (tales como proveedores externos de servicios técnicos, empresas de mensajería, empresas de hosting, empresas de informática, agencias de comunicación) que serán nombrados por ${appInfo.name} como Encargados del Tratamiento, si fuera necesario. Se podrá solicitar al Titular en cualquier momento una lista actualizada de dichas personas.`}
        </Text>
        <Container style={styles.separator} />
        <TitleText style={styles.subtitle}>PERIODO DE CONSERVACIÓN</TitleText>
        <Text style={styles.body}>
          {`Los Datos Personales serán tratados y conservados durante el tiempo necesario y para la finalidad por la que han sido recogidos. Por lo tanto:

Los Datos Personales recogidos para la formalización de un contrato entre ${appInfo.name} y el Usuario deberán conservarse como tales hasta en tanto dicho contrato se haya formalizado por completo.
Los Datos Personales recogidos en legítimo interés de ${appInfo.name} deberán conservarse durante el tiempo necesario para cumplir con dicha finalidad. Los Usuarios pueden encontrar información específica relacionada con el interés legítimo de ${appInfo.name} consultando las secciones relevantes del presente documento o contactando con ${appInfo.name}.
${appInfo.name} podrá conservar los Datos Personales durante un periodo adicional cuando el Usuario preste su consentimiento a tal tratamiento, siempre que dicho consentimiento siga vigente. Además, ${appInfo.name} estará obligado a conservar Datos Personales durante un periodo adicional siempre que se precise para el cumplimiento de una obligación legal o por orden que proceda de la autoridad.

Una vez terminado el período de conservación, los Datos Personales deberán eliminarse. Por lo tanto, los derechos de acceso, modificación, rectificación y portabilidad de datos no podrán ejercerse una vez haya expirado dicho periodo.`}
        </Text>
        <Container style={styles.separator} />
        <TitleText style={styles.subtitle}>
          FINALIDAD DEL TRATAMIENTO DE LOS DATOS RECOGIDOS
        </TitleText>
        <Text style={styles.body}>
          Los Datos relativos al Usuario son recogidos para permitir al Titular
          prestar su Servicio, cumplir sus obligaciones legales, responder a
          solicitudes de ejecución, proteger sus derechos e intereses (o los de
          sus Usuarios o terceros), detectar cualquier actividad maliciosa o
          fraudulenta, así como para las siguientes finalidades: Conexión de
          Datos y Gestión de la base de datos de Usuarios.
        </Text>
        <Container style={styles.separator} />
        <TitleText style={styles.subtitle}>
          OPOSICIÓN AL TRATAMIENTO DE LOS DATOS PERSONALES.
        </TitleText>
        <Text style={styles.body}>
          {`Con fundamento en el artículo 27 de la Ley Federal de Protección de Datos Personales en Posesión de los Particulares, Usted tiene derecho a oponerse al uso y tratamiento de sus datos personales, para lo cual deberá presentar solicitud de acceso, rectificación, cancelación u oposición a través del procedimiento denominado “Solicitud de acceso, rectificación, cancelación u oposición (derechos “ARCO”), presentando escrito dirigido a ${appInfo.name} en el domicilio ubicado en Retorno Mercedes SN, colonia La Manga, C.P. 83220, Hermosillo, Sonora, que deberá contener y al que debe acompañar con lo siguiente:

I. El nombre del titular y domicilio u otro medio para comunicarle la respuesta a su solicitud;
II. Los documentos que acrediten la identidad o, en su caso, la representación legal del titular;
III. La descripción clara y precisa de los datos personales respecto de los que se busca ejercer alguno de los derechos antes mencionados,
y
IV. Cualquier otro elemento o documento que facilite la localización de los datos personales.

En el caso de solicitudes de rectificación de datos personales, el titular, además de indicar lo señalado anteriormente, el interesado podrá aportar la documentación que sustente su petición. Con relación a una solicitud de cancelación o revocación de autorización para el tratamiento de datos personales, el titular deberá señalar las causas que lo motiven a solicitar la supresión de sus datos personales en los archivos, registros o bases de datos de ${appInfo.name}.

En el caso de la solicitud de oposición, el titular deberá manifestar las causas legítimas o la situación específica que lo llevan a solicitar el cese en el tratamiento, así como el daño o perjuicio que le causaría la persistencia del tratamiento, o en su caso las finalidades especificas respecto de las cuales requiere ejercer el derecho de oposición.

El titular podrá aportar las pruebas que estime pertinentes para acreditar la procedencia de su solicitud, las cuales deberán acompañarse a la misma desde el momento de su presentación.

Procedimiento. Presentada la solicitud de acceso, rectificación, cancelación u oposición de datos personales, ${appInfo.name} registrará la solicitud y entregará el acuse de recibo que corresponda. Registrada la solicitud, ${appInfo.name} procederá a verificar que cumpla con los requisitos aquí establecidos y en Ley Federal de Protección de Datos Personales en Posesión de los Particulares, así como si la información proporcionada por el solicitante es suficiente y correcta.

En caso de que la solicitud no satisfaga algunos de los requisitos que se indican o no se cuente con elementos para subsanarla, ${appInfo.name} podrá prevenir al solicitante dentro de los cinco días hábiles siguientes a la presentación de la misma para que por una sola ocasión, subsane las omisiones dentro de un plazo de diez días contados a partir del día siguiente al de la notificación. Transcurrido el plazo sin desahogar la prevención por parte del titular, se tendrá por no presentada la solicitud para el ejercicio de los derechos ARCO.

Plazo de respuesta. El plazo de respuesta no deberá exceder de veinte días contados a partir del día siguiente a la recepción de la solicitud. El plazo referido en el párrafo anterior, podrá ser ampliado por una sola vez hasta por diez días cuando así lo justifiquen las circunstancias y siempre y cuando se le notifique al titular dentro del plazo de respuesta.

En caso de resultar procedente el ejercicio de los derechos ARCO, el responsable deberá hacerlo efectivo en un plazo que no podrá exceder de quince días contados a partir del día siguiente en que se haya notificado la respuesta al titular solicitante.

Costos. El ejercicio de los derechos ARCO es gratuito. Solo podrán realizarse cobros para recuperar los costos de reproducción, certificación o envío, conforme a las disposiciones jurídicas aplicables. En su determinación se deberá considerar que los montos permitan o faciliten el ejercicio de este derecho.

Notificación. ${appInfo.name} notificará por el medio señalado para tal efecto la resolución a la solicitud y en su caso, el plazo para que el interesado o su representante legal pasen a recoger la información materia de su solicitud. Previa exhibición del original del documento con el que acreditó su identidad el interesado o su apoderado legal, se hará entrega de la información requerida. En caso de que el interesado o su representante legal no acudan a recoger la información materia de su solicitud, dentro del plazo señalado, en el domicilio de ${appInfo.name} aquí indicado, se procederá a la destrucción de dicha información.

Recursos. Si usted considera que su derecho de protección de datos personales ha sido lesionado por ${appInfo.name} o presume que en el tratamiento de sus datos personales existe alguna violación a las disposiciones previstas en la Ley, podrá interponer su queja o denuncia correspondiente ante el Instituto Federal de Acceso a la Información y Protección de Datos, IFAI (www.ifai.gob.mx), dentro de los 15 días siguientes a la fecha en que reciba la respuesta de ALTATECAPP o a partir de que concluya el plazo de 20 días contados a partir de la fecha del acuse de recepción de la Solicitud de ejercicio de derechos.`}
        </Text>
        <Text style={[styles.body, styles.marginTop]}>
          Al iniciar sesión aceptas que has leído el aviso de privacidad y
          otorgar consentimiento a Comunidad Alta para el tratamiento de tus
          datos personales.
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: theme.paddingLg },
  scrollContainer: {
    flexGrow: 1,
    paddingVertical: theme.paddingMd,
    paddingHorizontal: theme.paddingSm,
  },
  title: { textAlign: "center" },
  body: {
    textAlign: "justify",
  },
  separator: {
    borderTopWidth: 0,
    marginVertical: theme.marginY,
  },
  subtitle: {
    fontSize: 14,
  },
  marginTop: { marginTop: 40 },
});
