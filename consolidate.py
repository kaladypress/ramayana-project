import os

source_dir = r"c:\Users\mhari\Projects\ramayana-project\source\roman"
target_dir = r"c:\Users\mhari\Projects\ramayana-project\source\roman-consolidated"

os.makedirs(target_dir, exist_ok=True)

kandas = [
    "bala-kanda",
    "ayodhya-kanda",
    "aranya-kanda",
    "kishkindha-kanda",
    "sundara-kanda",
    "yuddha-kanda",
    "uttara-kanda"
]

for kanda in kandas:
    kanda_dir = os.path.join(source_dir, kanda)
    if not os.path.exists(kanda_dir):
        continue
    
    files = [f for f in os.listdir(kanda_dir) if f.endswith('.txt')]
    files.sort()  # Will sort sarga-001.txt, sarga-002.txt properly
    
    out_file_path = os.path.join(target_dir, f"{kanda}.txt")
    
    with open(out_file_path, "w", encoding="utf-8") as out_f:
        for file in files:
            file_path = os.path.join(kanda_dir, file)
            with open(file_path, "r", encoding="utf-8") as in_f:
                content = in_f.read().strip()
                out_f.write(content)
                out_f.write("\n\n")

print("Consolidation complete.")
