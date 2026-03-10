import type { Meta, StoryObj } from '@storybook/vue3'
import { ref } from 'vue'

const meta = {
  title: 'Base/Form Fields',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
### Overview
Text fields, selects, and textareas let users enter, edit, and select data in forms.

### 🟢 Do's
- **Do** use the \`variant="outlined"\` style. This is the default style for all Maropost forms.
- **Do** use \`density="comfortable"\` or \`density="compact"\` depending on the surrounding context and layout tightness.
- **Do** use \`hide-details="auto"\` or \`hide-details\` to prevent unnecessary vertical spacing when there are no hints or errors.

### 🔴 Don'ts
- **Don't** use \`variant="filled"\` or \`variant="underlined"\` as these break the visual consistency of the design system.
- **Don't** use placeholder text as a replacement for labels. Labels should always be present and visible above or floating inside the outline.
- **Don't** use a standard select if there are more than ~15 items. Use an \`v-autocomplete\` component so users can search.

### 💡 Best Practices
- **Icons:** Use \`prepend-inner-icon\` for inputs that benefit from visual affordances (like emails, search bars, passwords).
- **Validation:** Show inline validation errors as soon as the user finishes interacting with a field (on blur), not while they are actively typing.
- **Password Toggles:** Always include an \`append-inner-icon\` on password fields allowing users to toggle visibility so they can verify their input.
        `,
      },
    },
  },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

export const TextFields: Story = {
  render: () => ({
    setup() {
      const text = ref('')
      const email = ref('')
      const password = ref('')
      const showPass = ref(false)
      const search = ref('')
      return { text, email, password, showPass, search }
    },
    template: `
      <div class="d-flex flex-column ga-6" style="max-width: 480px;">
        <div>
          <div class="text-overline text-medium-emphasis mb-3">Variants</div>
          <div class="d-flex flex-column ga-4">
            <v-text-field v-model="text" label="Outlined (default)" variant="outlined" density="comfortable" hide-details />
            <v-text-field v-model="text" label="Filled" variant="filled" density="comfortable" hide-details />
            <v-text-field v-model="text" label="Solo" variant="solo" density="comfortable" hide-details />
            <v-text-field v-model="text" label="Underlined" variant="underlined" density="comfortable" hide-details />
            <v-text-field v-model="text" label="Plain" variant="plain" density="comfortable" hide-details />
          </div>
        </div>

        <div>
          <div class="text-overline text-medium-emphasis mb-3">Density</div>
          <div class="d-flex flex-column ga-4">
            <v-text-field v-model="text" label="Default density" variant="outlined" hide-details />
            <v-text-field v-model="text" label="Comfortable" variant="outlined" density="comfortable" hide-details />
            <v-text-field v-model="text" label="Compact" variant="outlined" density="compact" hide-details />
          </div>
        </div>

        <div>
          <div class="text-overline text-medium-emphasis mb-3">With Icons & Helpers</div>
          <div class="d-flex flex-column ga-4">
            <v-text-field
              v-model="search"
              label="Search"
              variant="outlined"
              density="comfortable"
              prepend-inner-icon="mdi-magnify"
              clearable
              hide-details
              rounded="lg"
            />
            <v-text-field
              v-model="email"
              label="Email Address"
              type="email"
              variant="outlined"
              density="comfortable"
              prepend-inner-icon="mdi-email-outline"
              hint="We'll never share your email"
              persistent-hint
            />
            <v-text-field
              v-model="password"
              label="Password"
              :type="showPass ? 'text' : 'password'"
              variant="outlined"
              density="comfortable"
              prepend-inner-icon="mdi-lock-outline"
              :append-inner-icon="showPass ? 'mdi-eye-off' : 'mdi-eye'"
              @click:append-inner="showPass = !showPass"
              hide-details
            />
          </div>
        </div>

        <div>
          <div class="text-overline text-medium-emphasis mb-3">States</div>
          <div class="d-flex flex-column ga-4">
            <v-text-field label="Normal" variant="outlined" density="comfortable" hide-details />
            <v-text-field label="Disabled" variant="outlined" density="comfortable" hide-details disabled value="Disabled value" />
            <v-text-field label="Readonly" variant="outlined" density="comfortable" hide-details readonly value="Readonly value" />
            <v-text-field label="Error state" variant="outlined" density="comfortable" error-messages="This field is required" />
          </div>
        </div>

        <div>
          <div class="text-overline text-medium-emphasis mb-3">Selects & Textarea</div>
          <div class="d-flex flex-column ga-4">
            <v-select
              label="Single Select"
              :items="['Option A', 'Option B', 'Option C', 'Option D']"
              variant="outlined"
              density="comfortable"
              hide-details
            />
            <v-select
              label="Multi Select"
              :items="['Option A', 'Option B', 'Option C', 'Option D']"
              multiple
              chips
              closable-chips
              variant="outlined"
              density="comfortable"
              hide-details
            />
            <v-autocomplete
              label="Autocomplete"
              :items="['Electronics', 'Apparel', 'Home & Kitchen', 'Sports & Outdoors', 'Beauty & Health']"
              variant="outlined"
              density="comfortable"
              prepend-inner-icon="mdi-magnify"
              hide-details
            />
            <v-textarea
              label="Textarea"
              variant="outlined"
              rows="3"
              auto-grow
              hide-details
              placeholder="Enter a description..."
            />
          </div>
        </div>
      </div>
    `,
  }),
}
