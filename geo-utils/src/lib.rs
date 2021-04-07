use geojson::Feature;
use std::{
    convert::TryFrom,
    io::{self, Read},
};
use wasm_bindgen::prelude::*;

use serde::Serialize;
use serde_json::{to_value, Map};

use geo::algorithm::bounding_rect::BoundingRect;
use geo::chamberlain_duquette_area::ChamberlainDuquetteArea;

#[wasm_bindgen]
extern "C" {
    #[wasm_bindgen(typescript_type = "Array<Shape>")]
    pub type ShapeArray;
}

#[derive(Serialize)]
pub struct Shape {
    pub area: f64,
    pub center: Vec<f64>,
    pub geojson: Feature,
}

// FIXME: Use `anyhow` to remove `unwrap()`'s and properly throw in JS runtime?
#[wasm_bindgen(js_name = getFeaturesFromShape)]
pub fn get_features_from_shape(zip_file: &[u8]) -> JsValue {
    console_error_panic_hook::set_once();

    let mut shapes: Vec<Shape> = vec![];

    // Parse zip file data
    let mut zip = zip::ZipArchive::new(io::Cursor::new(zip_file)).unwrap();

    // Find all .shp files in archive
    let shp_files: Vec<String> = zip
        .file_names()
        .map(String::from)
        .filter(|s| s.ends_with(".shp"))
        .collect();

    // Process each .shp file separately
    for name in shp_files.iter() {
        let mut shp: Vec<u8> = vec![];
        let mut dbf: Vec<u8> = vec![];

        // Read the entire .shp file (block is to control lifetime)
        {
            let mut file = zip.by_name(name).unwrap();
            file.read_to_end(&mut shp).unwrap();
        }

        // Read the entire .dbf file (block is to control lifetime)
        {
            let mut file = zip
                .by_name(&format!("{}{}", &name[0..name.len() - 3], "dbf"))
                .unwrap();
            file.read_to_end(&mut dbf).unwrap();
        }

        // Parse the shp/dbf pair
        let mut reader = shapefile::Reader::new(&shp[..]).unwrap();
        reader.add_dbf_source(&dbf[..]).unwrap();

        // Pull out each shape
        for row in reader.iter_shapes_and_records().unwrap() {
            let (shape, record) = row.unwrap();

            let g = geo_types::Geometry::<f64>::try_from(shape).unwrap();

            // Can we simplify?
            let mut properties = Map::new();
            for (key, value) in record {
                let v = match value {
                    shapefile::dbase::FieldValue::Character(c) => to_value(c).unwrap(),
                    shapefile::dbase::FieldValue::Numeric(c) => to_value(c).unwrap(),
                    shapefile::dbase::FieldValue::Logical(c) => to_value(c).unwrap(),
                    shapefile::dbase::FieldValue::Date(c) => match c {
                        Some(d) => to_value(d.to_string()).unwrap(),
                        None => serde_json::Value::Null,
                    },
                    shapefile::dbase::FieldValue::Float(c) => to_value(c).unwrap(),
                    shapefile::dbase::FieldValue::Integer(c) => to_value(c).unwrap(),
                    shapefile::dbase::FieldValue::Double(c) => to_value(c).unwrap(),
                };

                properties.insert(key, v);
            }

            let bbox = g.bounding_rect().unwrap();
            let center = bbox.center();

            shapes.push(Shape {
                area: area(&g) / 4046.86,
                center: vec![center.x, center.y],
                geojson: Feature {
                    bbox: Some(vec![bbox.min().x, bbox.min().y, bbox.max().x, bbox.max().y]),
                    geometry: Some(geojson::Geometry::new(geojson::Value::from(&g))),
                    id: None,
                    properties: Some(properties),
                    foreign_members: None,
                },
            });
        }
    }

    JsValue::from_serde(&shapes).unwrap()
}

fn area(g: &geo::Geometry<f64>) -> f64 {
    match g {
        geo::Geometry::Point(_)
        | geo::Geometry::Line(_)
        | geo::Geometry::LineString(_)
        | geo::Geometry::MultiPoint(_)
        | geo::Geometry::MultiLineString(_)
        | geo::Geometry::Rect(_)
        | geo::Geometry::Triangle(_) => 0.0,

        geo::Geometry::Polygon(p) => p.chamberlain_duquette_unsigned_area(),

        geo::Geometry::MultiPolygon(m) => m.iter().fold(0.0, |total, p| {
            total + p.chamberlain_duquette_unsigned_area()
        }),

        geo::Geometry::GeometryCollection(c) => c.iter().fold(0.0, |total, g| total + area(g)),
    }
}
