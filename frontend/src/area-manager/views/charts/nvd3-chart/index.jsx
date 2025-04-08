import { Row, Col, Card } from 'react-bootstrap';
import LineChartComponent from './chart/LineChart';
import PieChartComponent from './chart/PieChart';

const Nvd3Chart = () => {
  return (
    <>
      <Row>
        <Col md={6}>
          <Card>
            <Card.Header>
              <Card.Title as="h5">Payments Over Time</Card.Title>
            </Card.Header>
            <Card.Body> 
              <LineChartComponent />
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card>
            <Card.Header>
              <Card.Title as="h5">Payments by Method</Card.Title>
            </Card.Header>
            <Card.Body className="text-center">
              <PieChartComponent />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default Nvd3Chart;
