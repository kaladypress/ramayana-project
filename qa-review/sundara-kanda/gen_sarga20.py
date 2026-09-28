import re
import textwrap
import os

with open(r'c:\Users\mhari\Projects\ramayana-project\qa-review\sundara-kanda\sarga-020.txt', 'r', encoding='utf-8') as f:
    text = f.read()

# Fix analaṁkr̥tām to analaṅkr̥tām
text = text.replace('analaṁkr̥tām', 'analaṅkr̥tām')

# Extract verses
verses = {}
# Find all occurrences of verse number followed by lines until '=== meaning ==='
pattern = re.compile(r'^(\d+)\.\n(.*?)(?=\n=== meaning ===)', re.MULTILINE | re.DOTALL)
for match in pattern.finditer(text):
    v_num = int(match.group(1))
    v_text = match.group(2).strip()
    verses[v_num] = v_text

meanings = {
    (1, 4): "Rāvaṇa, with significant and sweet words, addressed that miserable, joyless, and ascetic lady, who was surrounded by Rākṣasīs: \"Seeing me, you are hiding your breasts and abdomen with your thighs that resemble the trunks of elephants. Out of fear, you wish to make yourself invisible as it were. O wide-eyed one! I desire you. O beloved, endowed with excellent qualities in all limbs, O captivator of all the worlds, respect me! O Sītā! There are no human beings here, nor Rākṣasas who can change their form at will. Let your fear arising from me depart.\"",
    (5, 7): "\"O timid lady! Approaching the wives of others or abducting them by force is by all means the natural dharma of the Rākṣasas. There is no doubt about this. Even so, O Maithilī, I will not touch you if you are unwilling. Let desire act as it wishes within my body. O divine lady! There is no cause for fear here. O beloved, trust in me! Show your affection truly and do not be so absorbed in sorrow.\"",
    (8, 11): "\"Wearing a single braid, sleeping on the ground, brooding, wearing soiled garments, and fasting inappropriately—these do not befit you. O Maithilī! Having attained me, obtain wonderful garlands, sandalwood paste, aloe wood, various garments, divine ornaments, highly precious drinks, conveyances, beds, song, dance, and instrumental music! You are a jewel among women. Do not remain like this; put ornaments on your limbs! Having attained me, how indeed can you, possessing a beautiful form, remain unadorned?\"",
    (12, 15): "\"This beautiful youth of yours is passing away. Once it is gone, it does not return, like the swift current of water. I believe that Viśvakarmā, the creator of forms, has ceased his work after creating you! O lady of auspicious appearance, there is no one else whose beauty can be compared to yours. O Vaidehī! Having encountered you, endowed with beauty and youth, what man could turn away, even Lord Brahmā himself? O lady with a face resembling the moon! O lady of broad hips! Whichever limb of yours I look at, my eyes become firmly fixed right there.\"",
    (16, 20): "\"O Maithilī, become my wife! Cast away this delusion. Become my chief queen among many excellent women! Whatever gems have been forcibly acquired by me from the worlds, all of them are yours, O timid lady! This kingdom and I myself are yours. O charming lady! Having conquered the entire earth garlanded with various cities, I shall give it to King Janaka for your sake. I do not see anyone else in the world who could be a match for me. Behold my immense valor, unmatched in battle! Repeatedly defeated in battle by me, with their banners crushed, the Devas and Asuras are unable to stand in the opposing army against me.\"",
    (21, 24): "\"Desire me! Let excellent adornment be done for you today. Let radiant ornaments be placed upon your body. I wish to see your form beautifully adorned! Endowed with adornments, out of kindness, O lady with an excellent face! Enjoy pleasures as you wish, drink, and rejoice, O timid lady! Bestow wealth or land to whomsoever you desire! Rejoice in me with confidence, and give commands boldly! By my power, as you rejoice, let your relatives rejoice as well.\"",
    (25, 28): "\"O auspicious lady! Behold my prosperity, my wealth, and my fame! O beautiful one! What will you do with Śrī Rāma, who is clad in bark garments? Śrī Rāma has lost his chance for victory, is bereft of fortune, and wanders in the forest. He observes ascetic vows and sleeps on the bare ground. I doubt whether he is even alive or not! O Vaidehī! Śrī Rāma will not even be able to get a glimpse of you, just as moonlight concealed by dark clouds preceded by cranes cannot be seen. Nor is Rāghava capable of regaining you from my hands, just as Hiraṇyakaśipu could not reclaim his glory that had fallen into the hands of Indra.\"",
    (29, 34): "\"O lady with a beautiful smile! O lady with beautiful teeth! O lady with beautiful eyes! O charming one! O timid lady! You steal my heart, just as Garuḍa snatches a serpent. Seeing you, wearing a soiled silk garment, slender, and unadorned, I no longer find pleasure in my own wives. O Jānakī! Exercise your lordship over all the women residing in my inner apartments, however many they may be, all endowed with every virtue. O lady with beautiful dark hair! My wives are the most excellent women in the three worlds. They will serve you, just as the Apsarās serve Goddess Śrī. O lady with beautiful eyebrows! Whatever gems and wealth belong to Kubera, enjoy them, the worlds, and me comfortably, O lady with beautiful hips! O divine lady! Śrī Rāma is not my equal in penance, nor in strength, nor in valor, nor in wealth, nor in brilliance, nor even in fame!\"",
    (35, 36): "\"Drink, sport, rejoice, and enjoy pleasures! I will bestow upon you hoards of wealth and the earth. O beautiful lady, enjoy yourself comfortably with me; united with you, let your relatives also rejoice. O timid lady! Adorned with a pure golden necklace, wander with me in the forests along the seashore, which are filled with clusters of blossoming trees and resonating with bees.\""
}

out_lines = ['=== Sarga 20 ===\n', '\n---\n']

for start_idx, end_idx in meanings.keys():
    for i in range(start_idx, end_idx + 1):
        if i in verses:
            out_lines.append(f"{i}.\n{verses[i]}\n\n")
    
    meaning_text = f"**Meaning {start_idx}-{end_idx}:** {meanings[(start_idx, end_idx)]}"
    wrapped = textwrap.wrap(meaning_text, width=80)
    for line in wrapped:
        out_lines.append(f"> {line}\n")
    out_lines.append("---\n\n")

new_path = r'c:\Users\mhari\Projects\ramayana-project\qa-review\sundara-kanda\sarga-020.md'
with open(new_path, 'w', encoding='utf-8') as f:
    f.writelines(out_lines)

os.remove(r'c:\Users\mhari\Projects\ramayana-project\qa-review\sundara-kanda\sarga-020.txt')
