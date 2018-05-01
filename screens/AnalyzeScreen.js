import { random, range, round } from "lodash";
import React, { Component } from "react";
import {
  ScrollView,
  StyleSheet,
  Platform,
  Text,
  Dimensions,
  View,
} from "react-native";
import Svg from "react-native-svg";
import {
  VictoryAxis,
  VictoryChart,
  VictoryGroup,
  VictoryStack,
  VictoryCandlestick,
  VictoryErrorBar,
  VictoryBar,
  VictoryLine,
  VictoryArea,
  VictoryScatter,
  VictoryTooltip,
  VictoryZoomContainer,
  VictoryVoronoiContainer,
  VictorySelectionContainer,
  VictoryBrushContainer,
  VictoryCursorContainer,
  VictoryPie,
  VictoryLabel,
  VictoryLegend,
  createContainer
} from "victory-native";

import { Icon, Header, Divider, Card, Button } from 'react-native-elements';

import { VictoryTheme } from "victory-core";

const window = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    backgroundColor: "white",
    justifyContent: "center",
    paddingLeft: 50,
    paddingRight: 50,
    paddingTop: 50
  },
  description: {
    fontSize: 14,
    fontWeight: '300',
    marginHorizontal: 40,
  },
  title:{
    fontSize: 18,
    fontWeight: "bold",
    textAlign: 'center',
    marginHorizontal: 40,
    marginTop: 40,
  },
  card:{
    marginRight: 20,
    marginLeft: 20,
    marginBottom: 40,
    marginTop: -20,
    // backgroundColor: 'red',
  },
  chartContainer:{
    flex: 1,
    alignItems: 'center',
  }
});

const candleData = [
  { x: 1, open: 9, close: 30, high: 56, low: 7 },
  { x: 2, open: 80, close: 40, high: 120, low: 10 },
  { x: 3, open: 50, close: 80, high: 90, low: 20 },
  { x: 4, open: 70, close: 22, high: 70, low: 5 },
  { x: 5, open: 20, close: 35, high: 50, low: 10 },
  { x: 6, open: 35, close: 30, high: 40, low: 3 },
  { x: 7, open: 30, close: 90, high: 95, low: 30 },
  { x: 8, open: 80, close: 81, high: 83, low: 75 }
];

const legendData = [{
  name: "Series 1",
  symbol: {
    type: "circle",
    fill: "green"
  }
}, {
  name: "Long Series Name",
  symbol: {
    type: "triangleUp",
    fill: "blue"
  }
}, {
  name: "Series 3",
  symbol: {
    type: "diamond",
    fill: "pink"
  }
}, {
  name: "Series 4",
  symbol: {
    type: "plus"
  }
}, {
  name: "Series 5",
  symbol: {
    type: "star",
    fill: "red"
  },
  labels: {
    fill: "purple"
  }
}, {
  name: "Series 6",
  symbol: {
    type: "circle",
    fill: "orange"
  },
  labels: {
    fill: "blue"
  }
}];

const legendStyle = { border: { stroke: "black" } };

const VictoryZoomVoronoiContainer = createContainer("zoom", "voronoi");

export default class Demo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      scrollEnabled: true,
      y: this.getYFunction(),
      style: this.getStyles(),
      transitionData: this.getTransitionData(),
      randomData: this.generateRandomData(),
      staticRandomData: this.generateRandomData(15),
      data: this.getData(),
      selected: [true, false, false, false],
    };
  }

  componentDidMount() {
    setInterval(this.updateDemoData.bind(this), 3000);
  }

  getYFunction() {
    const n = random(2, 7);
    return (data) => Math.exp(-n * data.x) * Math.sin(2 * n * Math.PI * data.x);
  }

  generateRandomData(points = 6) {
    return range(1, points + 1).map((i) => ({ x: i, y: i + random(-1, 2) }));
  }

  getData() {
    return range(1, 10).map((i) => ({ x: i, y: random(1, 10) }));
  }

  getStyles() {
    const colors = [
      "red", "orange", "magenta",
      "gold", "blue", "purple"
    ];
    return {
      stroke: colors[random(0, 5)],
      strokeWidth: random(1, 5)
    };
  }

  getTransitionData() {
    const n = random(4, 10);
    return range(n).map((i) => {
      return {
        x: i,
        y: random(2, 10)
      };
    });
  }

  changeScroll(scrollEnabled) {
    this.setState({ scrollEnabled });
  }

  updateDemoData() {
    this.setState({
      y: this.getYFunction(),
      style: this.getStyles(),
      transitionData: this.getTransitionData(),
      randomData: this.generateRandomData(),
      data: this.getData()
    });
  }

  render() {

    const cursorChart =
    <View>
      <Text style={styles.text}>{"VictoryCursorContainer"}</Text>
      <VictoryChart
        containerComponent={
          <VictoryCursorContainer
            onTouchStart={() => this.changeScroll(false)}
            onTouchEnd={() => this.changeScroll(true)}
            cursorLabel={(d) => (`${round(d.x, 2)} , ${round(d.y, 2)}`)}
          />
        }
      >
        { /* this causes a crash: <VictoryAxis tickLabelComponent={<VictoryLabel angle={45}/>}/> */ }
        { /* https://github.com/FormidableLabs/victory-native/issues/171 */ }
        <VictoryBar/>
      </VictoryChart>

      <Text style={styles.text}>{"VictorySelectionContainer"}</Text>
      <VictoryChart
        containerComponent={
          <VictorySelectionContainer
            onTouchStart={() => this.changeScroll(false)}
            onTouchEnd={() => this.changeScroll(true)}
          />
        }
      >
        <VictoryScatter
          data={this.state.staticRandomData}
          style={{ data: { fill: (d, active) => active ? "tomato" : "gray" } }}
        />
      </VictoryChart>
      <Text style={styles.text}>{"VictoryVoronoiContainer"}</Text>
      <VictoryChart
        containerComponent={
          <VictoryVoronoiContainer
            onTouchStart={() => this.changeScroll(false)}
            onTouchEnd={() => this.changeScroll(true)}
            labels={(d) => `( ${d.x} , ${d.y} )`}
          />
        }
      >
       <VictoryLine data={this.state.staticRandomData} />
      </VictoryChart>
    </View>

    const pieChart =
    <View style={styles.chartContainer}>
      <Text style={styles.text}>{"<VictoryPie/>"}</Text>

      <VictoryPie
        innerRadius={75}
        labelRadius={125}
        style={{ labels: { fontSize: 20 } }}
        data={this.state.randomData}
        animate={{ duration: 1500 }}
      />

      <VictoryPie
        style={{
          data: {
            stroke: "none",
            opacity: 0.3
          }
        }}
      />
      <VictoryPie innerRadius={90} />
      <VictoryPie
        endAngle={90}
        startAngle={-90}
      />
      <VictoryPie
        endAngle={90}
        innerRadius={90}
        padAngle={5}
        startAngle={-90}
      />
      <VictoryPie
        style={{
          labels: {
            fill: "white",
            stroke: "none",
            fontSize: 15,
            fontWeight: "bold"
          }
        }}
        data={[
          { x: "<5", y: 6279 },
          { x: "5-13", y: 9182 },
          { x: "14-17", y: 5511 },
          { x: "18-24", y: 7164 },
          { x: "25-44", y: 6716 },
          { x: "45-64", y: 4263 },
          { x: "≥65", y: 7502 }
        ]}
        innerRadius={70}
        labelRadius={100}
        colorScale={[
          "#D85F49",
          "#F66D3B",
          "#D92E1D",
          "#D73C4C",
          "#FFAF59",
          "#E28300",
          "#F6A57F"
        ]}
      />
      <VictoryPie
        style={{
          data: {
            stroke: (data) => data.y > 75 ? "black" : "none",
            opacity: (data) => data.y > 75 ? 1 : 0.4
          }
        }}
        data={[
          { x: "Cat", y: 62 },
          { x: "Dog", y: 91 },
          { x: "Fish", y: 55 },
          { x: "Bird", y: 55 }
        ]}
      />
    </View>

    const stackChart =
    <View style={styles.chartContainer}>
      <Text style={styles.text}>{"<VictoryChart/>"}</Text>

      <VictoryChart><VictoryBar/><VictoryLine/></VictoryChart>

      <VictoryChart><VictoryCandlestick data={candleData}/></VictoryChart>

      <VictoryChart domain={{ x: [0, 4] }}>
        <VictoryGroup
          labels={["a", "b", "c"]}
          offset={10}
          colorScale={"qualitative"}
        >
          <VictoryBar
            data={[
              { x: 1, y: 1 },
              { x: 2, y: 2 },
              { x: 3, y: 5 }
            ]}
          />
          <VictoryBar
            data={[
              { x: 1, y: 2 },
              { x: 2, y: 1 },
              { x: 3, y: 7 }
            ]}
          />
          <VictoryBar
            data={[
              { x: 1, y: 3 },
              { x: 2, y: 4 },
              { x: 3, y: 9 }
            ]}
          />
        </VictoryGroup>
      </VictoryChart>

      <VictoryChart animate={{ duration: 2000 }}>
        <VictoryBar
          labels={() => "Hi"}
          data={this.state.transitionData}
          style={{
            data: {
              fill: "tomato", width: 12
            }
          }}
          animate={{
            onExit: {
              duration: 500,
              before: () => ({
                y: 0,
                fill: "orange",
                label: "BYE"
              })
            }
          }}
        />
      </VictoryChart>

      <VictoryChart>
        <VictoryStack>
          <VictoryArea
            data={[
              { x: "a", y: 2 },
              { x: "b", y: 3 },
              { x: "c", y: 5 },
              { x: "d", y: 4 },
              { x: "e", y: 7 }
            ]}
          />
          <VictoryArea
            data={[
              { x: "a", y: 1 },
              { x: "b", y: 4 },
              { x: "c", y: 5 },
              { x: "d", y: 7 },
              { x: "e", y: 5 }
            ]}
          />
          <VictoryArea
            data={[
              { x: "a", y: 3 },
              { x: "b", y: 2 },
              { x: "c", y: 6 },
              { x: "d", y: 2 },
              { x: "e", y: 6 }
            ]}
          />
          <VictoryArea
            data={[
              { x: "a", y: 2 },
              { x: "b", y: 3 },
              { x: "c", y: 3 },
              { x: "d", y: 4 },
              { x: "e", y: 7 }
            ]}
          />
        </VictoryStack>
      </VictoryChart>
    </View>

    const lineChart =
    <View style={styles.chartContainer}>
      <Card containerStyle={styles.card}>
        <Text style={styles.title}>{"Simple Pi Graph"}</Text>

          <VictoryLine y={(data) => Math.sin(2 * Math.PI * data.x)} />

        <Text style={styles.description}>
          The idea with React Native Elements is more about component structure than actual design.
        </Text>
        <Button
          title='View Details'
          style={{marginRight: 40, marginLeft: 40, marginTop: 20,}}
          />
      </Card>

      <Card containerStyle={styles.card}>
        <Text style={styles.title}>{"I wish my Bitcoin graph like this"}</Text>

          <VictoryLine
            height={300}
            domain={[0, 5]}
            padding={75}
            data={[
              { x: 0, y: 1 },
              { x: 1, y: 3 },
              { x: 2, y: 2 },
              { x: 3, y: 4 },
              { x: 4, y: 3 },
              { x: 5, y: 5 }
            ]}
            interpolation="cardinal"
            labels={["LINE"]}
            style={{
              data: {
                stroke: "#822722",
                strokeWidth: 3
              },
              labels: { fontSize: 12 }
            }}
          />

        <Text style={styles.description}>
          The idea with React Native Elements is more about component structure than actual design.
        </Text>
        <Button
          title='View Details'
          style={{marginRight: 40, marginLeft: 40, marginTop: 20,}}
          />
      </Card>

      <Card containerStyle={styles.card}>
        <Text style={styles.title}>{"I wish my Ethereum graph like this"}</Text>

          <VictoryLine
            width={300}
            style={{
              data: {
                stroke: (data) => {
                  const y = data.map((d) => d.y);
                  return Math.max(...y) > 2 ?
                    "red" : "blue";
                }
              }
            }}
            data={[
              { x: 0, y: 1 },
              { x: 1, y: 3 },
              { x: 2, y: 2 },
              { x: 3, y: 4 },
              { x: 4, y: 3 },
              { x: 5, y: 5 }
            ]}
          />

        <Text style={styles.description}>
          The idea with React Native Elements is more about component structure than actual design.
        </Text>
        <Button
          title='View Details'
          style={{marginRight: 40, marginLeft: 40, marginTop: 20,}}
          />
      </Card>

      <Card containerStyle={styles.card}>
        <Text style={styles.title}>{"I wish my paycheck was like this"}</Text>

          <VictoryLine
            style={{
              data: { stroke: "red", strokeWidth: 9 }
            }}
            interpolation={"linear"}
            data={[
              { x: 0, y: 1 },
              { x: 1, y: 3 },
              { x: 2, y: 2 },
              { x: 3, y: 4 },
              { x: 4, y: 3 },
              { x: 5, y: 5 }
            ]}
          />

        <Text style={styles.description}>
          The idea with React Native Elements is more about component structure than actual design.
        </Text>
        <Button
          title='View Details'
          style={{marginRight: 40, marginLeft: 40, marginTop: 20,}}
          />
      </Card>


      <Card containerStyle={styles.card}>
        <Text style={styles.title}>{"Bonus interpolation graph"}</Text>

          <VictoryLine
            style={{ data: this.state.style }}
            interpolation="basis"
            animate={{ duration: 1500 }}
            y={this.state.y}
          />

        <Text style={styles.description}>
          The idea with React Native Elements is more about component structure than actual design.
        </Text>
        <Button
          title='View Details'
          style={{marginRight: 40, marginLeft: 40, marginTop: 20,}}
          />
      </Card>



    </View>

    const areaChart =
    <View style={styles.chartContainer}>
      <Card containerStyle={styles.card}>
        <Text style={styles.title}>{"Spendings Over Last 3 Months"}</Text>

          <VictoryStack
            width={300}
            height={450}
            style={{ data: {
              strokeDasharray: "5,5",
              strokeWidth: 2,
              fillOpacity: 0.4
            } }}
          >
            <VictoryArea
              style={{ data: {
                fill: "tomato", stroke: "tomato"
              } }}
              data={[
                { x: 1, y: 1 },
                { x: 2, y: 2 },
                { x: 3, y: 3 }
              ]}
            />
            <VictoryArea
              style={{ data: {
                fill: "orange", stroke: "orange"
              } }}
              data={[
                { x: 1, y: 2 },
                { x: 2, y: 1 },
                { x: 3, y: 1 }
              ]}
            />
            <VictoryArea
              style={{ data: {
                fill: "gold", stroke: "gold"
              } }}
              data={[
                { x: 1, y: 3 },
                { x: 2, y: 4 },
                { x: 3, y: 2 }
              ]}
            />
          </VictoryStack>

        <Text style={styles.description}>
          The idea with React Native Elements is more about component structure than actual design.
        </Text>
        <Button
          title='View Details'
          style={{marginRight: 40, marginLeft: 40, marginTop: 20,marginBottom:0}}
          />
      </Card>

      <Card containerStyle={styles.card}>
        <Text style={styles.title}>{"Spendings Over Last 3 Months"}</Text>

        <VictoryArea
          interpolation="basis"
          animate={{ duration: 2000 }}
          data={this.state.data}
        />

        <Text style={styles.description}>
          The idea with React Native Elements is more about component structure than actual design.
        </Text>
        <Button
          title='View Details'
          style={{marginRight: 40, marginLeft: 40, marginTop: 20,}}
          />
      </Card>





    </View>

    const barChart =
    <View>

      <Card containerStyle={styles.card}>
        <Text style={styles.title}>{"Spendings Over Last 3 Months"}</Text>

          <VictoryGroup
            width={300}
            height={175}
            offset={20}
            colorScale={"qualitative"}
          >
            <VictoryBar
              data={[
                { x: 1, y: 1 },
                { x: 2, y: 2 },
                { x: 3, y: 3 }
              ]}
            />
            <VictoryBar
              data={[
                { x: 1, y: 2 },
                { x: 2, y: 1 },
                { x: 3, y: 1 }
              ]}
            />
            <VictoryBar
              data={[
                { x: 1, y: 3 },
                { x: 2, y: 4 },
                { x: 3, y: 2 }
              ]}
            />
          </VictoryGroup>

        <Text style={styles.description}>
          The idea with React Native Elements is more about component structure than actual design.
        </Text>
        <Button
          title='View Details'
          style={{marginRight: 40, marginLeft: 40, marginTop: 20,}}
          />
      </Card>


      <Card containerStyle={styles.card}>
        <Text style={styles.title}>{"Spendings Over Last 3 Months"}</Text>
            <VictoryStack
              width={300}
              height={175}
              colorScale={"qualitative"}
            >
              <VictoryBar
                data={[
                  { x: 1, y: 1 },
                  { x: 2, y: 2 },
                  { x: 3, y: 3 }
                ]}
              />
              <VictoryBar
                data={[
                  { x: 1, y: 2 },
                  { x: 2, y: 1 },
                  { x: 3, y: 1 }
                ]}
              />
              <VictoryBar
                data={[
                  { x: 1, y: 3 },
                  { x: 2, y: 4 },
                  { x: 3, y: 2 }
                ]}
              />
            </VictoryStack>

        <Text style={styles.description}>
          The idea with React Native Elements is more about component structure than actual design.
        </Text>
        <Button
          title='View Details'
          style={{marginRight: 40, marginLeft: 40, marginTop: 20,}}
          />
      </Card>

      <Card containerStyle={styles.card}>
        <Text style={styles.title}>{"Spendings Over Last 3 Months"}</Text>
          <VictoryBar
            height={275}
            padding={75}
            style={{
              data: {
                fill: (data) => data.y > 2 ? "red" : "blue"
              }
            }}
            data={[
              { x: 1, y: 1 },
              { x: 2, y: 2 },
              { x: 3, y: 3 },
              { x: 4, y: 2 },
              { x: 5, y: 1 }
            ]}
          />
        <Text style={styles.description}>
          The idea with React Native Elements is more about component structure than actual design.
        </Text>
        <Button
          title='View Details'
          style={{marginRight: 40, marginLeft: 40, marginTop: 20,}}
          />
      </Card>
    </View>

    let { selected } = this.state;

    return (
      <View style={{flex: 1}}>
        <Header backgroundColor='white'
          statusBarProps={{ barStyle: 'dark-content' }}
          centerComponent={{ text: 'Analyze Spending', style:{fontSize: 22, fontWeight: '300'}}}
          outerContainerStyles={{width: window.width, marginBottom: 0, borderBottomColor: '#bbb', borderBottomWidth:0.4, paddingBottom:5}}
        />
      <View style={{height: 80, backgroundColor: 'white',flexDirection:'row', alignItems: 'center', justifyContent: 'space-around'}}>
          <Icon
            raised
            reverse={this.state.selected[0]}
            name='area-chart'
            type='font-awesome'
            color='red'
            onPress={()=>this.setState({selected:[true,false,false,false]})}
            />
          <Icon
            raised
            reverse={this.state.selected[1]}
            name='bar-chart'
            type='font-awesome'
            color='green'
            onPress={()=>this.setState({selected:[false,true,false,false]})}
            />
          <Icon
            raised
            reverse={this.state.selected[2]}
            name='pie-chart'
            type='font-awesome'
            color='blue'
            onPress={()=>this.setState({selected:[false,false,true,false]})}
            />
          <Icon
            raised
            reverse={this.state.selected[3]}
            name='line-chart'
            type='font-awesome'
            color='purple'
            onPress={()=>this.setState({selected:[false,false,false,true]})}
            />
        </View>
        <ScrollView contentContainerStyle={styles.container} scrollEnabled={this.state.scrollEnabled}>
          {selected[0]?areaChart:null}
          {selected[1]?barChart:null}
          {selected[2]?pieChart:null}
          {selected[3]?lineChart:null}
        </ScrollView>
      </View>
    );
  }
}
