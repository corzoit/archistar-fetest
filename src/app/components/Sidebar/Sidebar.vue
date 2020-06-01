<template>
  <nav v-if="loading" class="sidebar" :class="{ 'sidebar-collapse': show }">
    <div class="sidebar-header" :class="{ 'flex-column': !show }">
      <div class="sidebar-toggle">
        <a-button type="link" @click="onToggle">
          <fa icon="bars" size="lg" />
        </a-button>
      </div>
      <div class="sidebar-title" :class="{ 'flex-column': !show }">
        <h3 class="m-0" :class="{ 'vertical mt-2': !show }">
          Geo Finder
        </h3>
      </div>
    </div>
    <div v-if="show" class="sidebar-filters py-1">
      <a-form-model :model="form">
        <a-form-model-item class="mb-1" label="Project Id">
          <a-input v-model="form.id" placeholder="e.g. 7426971" />
        </a-form-model-item>
        <a-form-model-item class="mb-1" label="Activity zone" prop="region">
          <a-select v-model="form.suburb" placeholder="please select your zone">
            <a-select-option
              v-for="(value, key) in suburbs"
              :key="key"
              :value="value"
            >
              {{ capitalize(value) }}
            </a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item class="mb-1" label="Category" prop="category">
          <a-checkbox-group v-model="form.categories">
            <div v-for="(value, key) in categories" :key="key">
              <a-checkbox :value="value" name="type">
                {{ capitalize(value) }}
              </a-checkbox>
              <br />
            </div>
          </a-checkbox-group>
        </a-form-model-item>
        <a-form-model-item class="mb-1" label="Status" prop="status">
          <a-checkbox-group v-model="form.status">
            <div v-for="(value, key) in status" :key="key">
              <a-checkbox :value="value" name="type">
                {{ capitalize(value) }}
              </a-checkbox>
              <br />
            </div>
          </a-checkbox-group>
        </a-form-model-item>
        <a-form-model-item
          class="mb-1"
          label="Commence year"
          prop="commence year"
        >
          <a-slider
            v-model="form.commenceYear"
            :marks="marksCommenceYear"
            :min="years.min"
            :max="years.max"
          />
        </a-form-model-item>
        <a-form-model-item class="mb-1" label="Budget" prop="budget">
          <a-slider
            v-model="form.budget"
            range
            :tip-formatter="numeral"
            :marks="marksBudget"
            :min="budget.min"
            :max="budget.max"
          />
        </a-form-model-item>
        <a-form-model-item>
          <a-button type="primary" block @click="onSubmit">
            Filter
          </a-button>
        </a-form-model-item>
      </a-form-model>
    </div>
  </nav>
</template>

<script>
export default {
  props: {
    suburbs: {
      type: Array,
      required: true
    },
    categories: {
      type: Array,
      required: true
    },
    status: {
      type: Array,
      required: true
    },
    years: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      form: {
        id: null,
        suburb: undefined,
        categories: [],
        status: [],
        commenceYear: null,
        budget: [100000, 2000000]
      },
      budget: {
        min: 100000,
        max: 2000000
      },
      show: false,
      loading: false
    }
  },
  computed: {
    marksCommenceYear() {
      const { min } = this.years
      const { max } = this.years
      let object = {}

      object[min] = min
      object[max] = max

      return object
    },
    marksBudget() {
      return { 100000: this.numeral(100000), 2000000: this.numeral(2000000) }
    }
  },
  mounted() {
    this.form.commenceYear = this.years.min
    this.loaded()
  },
  methods: {
    loaded() {
      this.loading = true
    },
    isLoaded() {
      return this.loading
    },
    capitalize(value) {
      return voca.capitalize(value, true)
    },
    numeral(value) {
      return numeral(value).format('0,0')
    },
    onToggle() {
      this.show = !this.show
    },
    onSubmit() {
      this.$emit('submit', this.form)
    }
  }
}
</script>

<style lang="scss" scoped>
.sidebar {
  background-color: lighten($gray, 12%);
  width: 4rem;
  height: 100vh;
  overflow-x: hidden;
  overflow-y: scroll;
  transition: all 0.3s ease;

  &-collapse {
    width: 25rem;
  }

  &-header {
    display: flex;
    align-items: center;
  }

  &-title {
    display: flex;
    padding: 0 0.5rem;

    .vertical {
      transform: rotate(180deg);
      writing-mode: vertical-rl;
    }
  }

  &-filters {
    padding-left: 2rem;
    padding-right: 2rem;
  }

  &-toggle {
    padding: 0.3rem;
  }
}
</style>
