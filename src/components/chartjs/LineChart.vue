<script>
import { Line, mixins } from "vue-chartjs";
const { reactiveProp } = mixins;

export default {
  extends: Line,
  props: ["labels", "chartdata", "options"],
  mounted() {
    this.render();
  },
  watch: {
    labels: function () {
      this.render();
    },
  },
  methods: {
    render() {
      this.renderChart(
        {
          labels: this.labels,
          datasets: this.chartdata,
        },
        this.options
      );
    },
  },
};
</script>