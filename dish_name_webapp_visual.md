# **Visual Requirements: Dish Name Generator Web App**

---

## **1. Layout Overview**
A clean, text-only web interface with three primary views:

1. **Home / Upload Page**
2. **Name Suggestion Page**
3. **History Page (optional)**

---

## **2. Page 1: Home / Upload Page**

### **Layout Sketch (Text-based Wireframe)**
```
-----------------------------------------------
| Dish Name Generator                         |
-----------------------------------------------
| [ Upload a Photo of Your Dish ]              |
|  (Click to upload or drag & drop)            |
|                                               |
| [ Generate Dish Names ] (disabled until file) |
-----------------------------------------------
| © 2025 Dish Name Generator | History | About |
-----------------------------------------------
```

### **Functional Elements**
- **Upload Button:** Allows photo upload (JPG/PNG only).
- **Generate Button:** Triggers name generation (enabled after upload).
- **Footer:** Minimal navigation with text links.

### **Behavior**
- Once a photo is uploaded, show a small thumbnail preview.
- After clicking *Generate Dish Names*, transitions to the Name Suggestion Page.

---

## **3. Page 2: Name Suggestion Page**

### **Layout Sketch (Text-based Wireframe)**
```
-----------------------------------------------
| Dish Name Generator                         |
-----------------------------------------------
| [ Dish Photo Thumbnail ]                    |
|---------------------------------------------|
| Suggested Names:                            |
|                                              |
| (1) [ The Crimson Curry ]                   |
| (2) [ Sunday Spice Symphony ]               |
| (3) [ The Gentle Roast ]                    |
|                                              |
| [ Regenerate Suggestions ]                  |
-----------------------------------------------
| History | Back |                            |
-----------------------------------------------
```

### **Functional Elements**
- **Three clickable text buttons:** for selecting a preferred name.
- **Regenerate Button:** creates a new set of 3 suggestions.
- **Back Link:** returns to Upload Page.
- **History Link:** navigates to History Page.

### **Behavior**
- When a name is clicked, selection is saved.
- Brief confirmation message appears (e.g., “Saved as: Sunday Spice Symphony”).
- Optionally auto-redirect back to Upload Page after confirmation.

---

## **4. Page 3: History Page (Optional)**

### **Layout Sketch (Text-based Wireframe)**
```
-----------------------------------------------
| Dish Name Generator - History               |
-----------------------------------------------
| 1. [Photo]  The Crimson Curry (Nov 3, 2025) |
| 2. [Photo]  Summer Herb Delight (Oct 26)    |
| 3. [Photo]  Lazy Sunday Pasta (Oct 19)      |
|---------------------------------------------|
| [ Back to Upload ]                          |
-----------------------------------------------
```

### **Functional Elements**
- **List of past dishes:** shows photo thumbnails and selected names.
- **Back Button:** returns to upload page.

---

## **5. Design Style Guide**

### **Typography**
- Font: monospace or system default (no styling).
- Size hierarchy:
  - Page Title: 18–20px bold
  - Options: 16px regular
  - Buttons/Links: 14–16px

### **Color & Theme**
- Purely text-based UI; default black text on white background.
- Buttons and links use subtle underline or brackets for interactivity.

### **Spacing & Layout**
- Center-aligned column layout.
- Generous vertical spacing between elements (32–48px).
- Consistent margins and padding.

---

## **6. Interaction Flow (User Journey)**

1. **Upload Page →** Upload photo → Click *Generate* →
2. **Name Suggestion Page →** Choose name → Confirmation →
3. **(Optional)** View *History* to see past dishes.

---

## **7. Accessibility & Simplicity Notes**
- All interactions are keyboard-accessible.
- Minimal use of color for full accessibility.
- Focus on fast load and single-column readability.

---

## **8. Responsive Behavior**
- **Mobile:** stacked layout with centered text.
- **Desktop:** centered fixed-width container (~600px wide).
- Image preview scales down automatically.

---

## **9. Future Visual Enhancements (Optional)**
- Add subtle hover underline on options.
- Allow light/dark text themes.
- Add emoji reactions for fun feedback (e.g., 🍝 ❤️ 😂) — optional add-on.

---

**End of Visual Requirement Document**

