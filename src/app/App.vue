<template>
  <div v-if="loading" id="app" class="d-flex">
    <sidebar
      :suburbs="option.suburbs"
      :categories="option.categories"
      :status="option.status"
      :years="option.years"
      @submit="onSubmit"
    />
    <map-box :features="map.features" />
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      geoData: null,
      features: null,
      properties: null,
      projects: null,
      option: {
        suburbs: null,
        categories: null,
        status: null,
        years: null
      },
      map: {
        features: null
      },
      loading: false
    }
  },
  async mounted() {
    const geoData = await this.fetchDb()
    const { features } = geoData
    const properties = this.getPropertiesFromFeatures(features)
    const projects = this.getProjectsFromProperties(properties)
    const suburbs = this.getSuburbsOptionByProjects(projects)
    const categories = this.getCategoriesOptionByProjects(projects)
    const status = this.getStatusOptionByProjects(projects)
    const years = this.getYearsOptionByProjects(projects)

    this.setGeoData(geoData)
    this.setFeatures(features)
    this.setProperties(properties)
    this.setProjects(projects)
    this.setSuburbsOption(suburbs)
    this.setCategoriesOption(categories)
    this.setStatusOption(status)
    this.setYearsOption(years)

    this.setFeaturesMap(features)
    this.loaded()
  },
  methods: {
    loaded() {
      this.loading = true
    },
    isLoaded() {
      return this.loading
    },
    setGeoData(value) {
      this.geoData = value
    },
    setFeatures(value) {
      this.features = value
    },
    setProperties(value) {
      this.properties = value
    },
    setProjects(value) {
      this.projects = value
    },
    setSuburbsOption(value) {
      this.option.suburbs = value
    },
    setCategoriesOption(value) {
      this.option.categories = value
    },
    setStatusOption(value) {
      this.option.status = value
    },
    setYearsOption(value) {
      this.option.years = value
    },
    setFeaturesMap(value) {
      this.map.features = value
    },
    getPropertiesFromFeatures(array) {
      return _.map(array, (value, key) => {
        return value.properties
      })
    },
    getProjectsFromProperties(array) {
      return _.map(array, (value, key) => {
        return value.project
      })
    },
    groupBy(array, key) {
      return _.groupBy(array, value => {
        return value[key]
      })
    },
    getOptionByProjects(array, key) {
      return _.keys(this.groupBy(array, key))
    },
    getSuburbsOptionByProjects(array) {
      return this.getOptionByProjects(array, 'Suburb')
    },
    getCategoriesOptionByProjects(array) {
      return this.getOptionByProjects(array, 'Category')
    },
    getStatusOptionByProjects(array) {
      return this.getOptionByProjects(array, 'Status')
    },
    getYearsOptionByProjects(array) {
      const years = this.getOptionByProjects(array, 'Commence Date')
      const objects = _.map(years, value => moment(value, 'DD/MM/YY'))
      const moments = _.toArray(_.pickBy(objects, value => value.isValid()))

      const min = parseInt(moment.min(moments).format('YYYY'), 10)
      const max = parseInt(moment.max(moments).format('YYYY'), 10)

      return { min, max }
    },
    orFilter(features, filters, key) {
      if (filters.length === 0) {
        return features
      }

      return _.filter(features, o => {
        let status = false

        _.forEach(filters, filter => {
          if (o.properties.project[key] === filter) {
            status = true
          }
        })

        return status
      })
    },
    filterById(array, id) {
      return _.filter(array, o => o.properties['id'] === id)
    },
    filterBySuburb(array, filter) {
      return _.filter(array, o => o.properties.project['Suburb'] === filter)
    },
    filterByCategories(array, filters) {
      return this.orFilter(array, filters, 'Category')
    },
    filterByStatus(array, filters) {
      return this.orFilter(array, filters, 'Status')
    },
    filterByCommenceYear(array, filter) {
      return _.filter(array, o => {
        const str = o.properties.project['Commence Date']
        const date = moment(str, 'DD/MM/YY')

        if (!date.isValid()) {
          return false
        }

        const year = parseInt(date.format('YYYY'), 10)

        return year >= filter
      })
    },
    filterByBudget(array, filters) {
      if (filters.length === 0) {
        return features
      }

      const min = filters[0]
      const max = filters[1]

      return _.filter(array, o => {
        const value = o.properties.project['Value']
        const str = value.split('.').join('')
        const number = parseInt(str, 10)

        return number >= min && number <= max
      })
    },
    async fetchDb() {
      try {
        const { data } = await axios.get('/db.json')
        return data
      } catch (error) {
        console.error(error)
      }
    },
    onSubmit(filters) {
      let features = this.features

      _.forEach(filters, (value, key) => {
        if (value) {
          switch (key) {
            case 'id':
              features = this.filterById(features, value)
              break
            case 'suburb':
              features = this.filterBySuburb(features, value)
              break
            case 'categories':
              features = this.filterByCategories(features, value)
              break
            case 'status':
              features = this.filterByStatus(features, value)
              break
            case 'commenceYear':
              features = this.filterByCommenceYear(features, value)
              break
            case 'budget':
              features = this.filterByBudget(features, value)
              break
          }
        }
      })

      this.setFeaturesMap(features)
    }
  }
}
</script>

<style></style>
