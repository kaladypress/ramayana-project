const Sanscript = require('@indic-transliteration/sanscript');

function applyParasavarna(text) {
  const nasalFor = (cp) => {
    if (cp >= 0x0915 && cp <= 0x0919) return '\u0919';
    if (cp >= 0x091A && cp <= 0x091E) return '\u091E';
    if (cp >= 0x091F && cp <= 0x0923) return '\u0923';
    if (cp >= 0x0924 && cp <= 0x0928) return '\u0928';
    if (cp >= 0x092A && cp <= 0x092E) return '\u092E';
    return null;
  };
  return text.replace(/\u0902([\u0915-\u092E])/g, (m, c) => {
    const n = nasalFor(c.codePointAt(0));
    return n ? n + '\u094D' + c : m;
  });
}

const input1 = "वानरान् सुमहाकायान् सर्वान् वै वनचारिणः || अप्सरस्सु च मुख्यासु तदा विद्यधरीषु च |";
const input2 = "नागकन्यासु च तथा गन्धर्वीणां तनूषु च |";

console.log(Sanscript.t(applyParasavarna(input1), 'devanagari', 'iso'));
console.log(Sanscript.t(applyParasavarna(input2), 'devanagari', 'iso'));

