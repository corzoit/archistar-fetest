<template>
  <div v-if="loading" class="container-fluid">
    <div class="row">
      <div class="col-12 p-0">
        <MglMap v-bind="mapProps">
          <MglMarker
            v-for="(feature, key) in features"
            :key="key"
            :coordinates="feature.geometry.coordinates"
            :color="feature.properties.color"
          >
            <MglPopup>
              <div class="p-1">
                <ul class="list-unstyled p-0">
                  <li>
                    <strong>Project Id: </strong>
                    <span>{{ feature.properties.id }}</span>
                  </li>
                  <li>
                    <strong>Title: </strong>
                    <span>
                      {{ capitalize(feature.properties.project['Title']) }}
                    </span>
                  </li>
                  <li>
                    <strong>Type: </strong>
                    <span>
                      {{ feature.properties.project['Type'] }}
                    </span>
                  </li>
                  <li>
                    <strong>Address: </strong>
                    <span>
                      {{ feature.properties.project['Address'] }}
                    </span>
                  </li>
                  <li>
                    <strong>Value: </strong>
                    <span>
                      $ {{ numeral(feature.properties.project['Value']) }}
                    </span>
                  </li>
                </ul>
              </div>
            </MglPopup>
          </MglMarker>
        </MglMap>
      </div>
    </div>
  </div>
</template>

<script>
import Mapbox from 'mapbox-gl'
import { MglMap, MglMarker, MglPopup, VCard } from 'vue-mapbox'

export default {
  components: {
    MglMap,
    MglMarker,
    MglPopup
  },
  props: {
    features: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      accessToken:
        'pk.eyJ1IjoiY29yem9kZXYiLCJhIjoiY2thcm16azk1MGxmZjJ4bnY2bDhsaThtOCJ9.n1B-YfAnESUsursYnmo9Ug',
      mapStyle: 'mapbox://styles/corzodev/ckarn16i40hjc1ilknfzwfjjo',
      loading: false
    }
  },
  computed: {
    mapProps() {
      let props = {}
      const accessToken = this.accessToken
      const mapStyle = this.mapStyle

      props = { accessToken, mapStyle }

      if (this.features.length > 0) {
        props['center'] = this.features[0].geometry.coordinates
        props['zoom'] = 14
      }

      return props
    }
  },
  created() {
    // We need to set mapbox-gl library here in order to use it in template
    this.mapbox = Mapbox
  },
  mounted() {
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
      const str = value.split('.').join('')
      const number = parseInt(str, 10)

      return numeral(number).format('0,0')
    }
  }
}
</script>

<style scoped>
.mgl-map-wrapper {
  width: 100%;
  height: 100vh;
}
</style>
