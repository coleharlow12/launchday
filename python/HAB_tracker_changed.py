import serial #imports the serial module 
import time #imports the time module

ser = serial.Serial('/dev/cu.usbserial-A906NC0Z', 57600)
time.sleep(2) # pauses for 2 seconds and allows the radio time to start recieving a signal

ser.readline() #serial is used to go through first lines of inputs
ser.readline()
ser.readline()

ser.flushInput()

longitude = ser.readline() # reads the longitude data from serial
latitude = ser.readline() # reads the latitude data from serial
altitude = ser.readline() # reads the altitude data from serial
ser.flushInput() #flushs the serial moniter

strLongitude = longitude.replace(" ", "")
strLatitude = latitude.replace(" ", "")

floatLong = float(strLongitude)
floatLat= float(strLatitude)

lastLong = floatLong
lastLat = floatLat

#open the file to be written
f = open('entirePath.kml', 'w')

f.write("<?xml version='1.0' encoding='UTF-8'?>\n" #begins writing the KML file line by line in the correct format
"<kml xmlns='http://www.opengis.net/kml/2.2'>\n"
"<Document>\n"
"<Style id='yellowPoly'>\n"
"<LineStyle>\n"
"<color>7f00ffff</color>\n"
"<width>15</width>\n"
"</LineStyle>\n"
"<PolyStyle>\n"
"<color>7f00ff00</color>\n"
"</PolyStyle>\n"
"</Style>\n"
"<Placemark><styleUrl>#yellowPoly</styleUrl>\n"
"<LineString>\n"
"<extrude>1</extrude>\n"
"<tesselate>1</tesselate>\n"
"<altitudeMode>absolute</altitudeMode>\n"
"<coordinates>\n")
f.write("%f,%f,%f " % (float(longitude),float(latitude),float(altitude)))  #This line inputs the first set of coordinates into the KML file
f.write("\n</coordinates>\n"
"</LineString></Placemark>\n\n"
"</Document></kml>")

#Closes the files
f.close()

# creates another file in write mode that displays only the current location
f = open('currentLocation.kml', 'w')

f.write("<?xml version='1.0' encoding='UTF-8'?>\n" #begins writing the KML file line by line in the correct format
"<kml xmlns='http://www.opengis.net/kml/2.2'>\n"
"<Document>\n"
"<Style id='yellowPoly'>\n"
"<LineStyle>\n"
"<color>7f00ffff</color>\n"
"<width>15</width>\n"
"</LineStyle>\n"
"<PolyStyle>\n"
"<color>7f00ff00</color>\n"
"</PolyStyle>\n"
"</Style>\n"
"<Placemark><styleUrl>#yellowPoly</styleUrl>\n"
"<LineString>\n"
"<extrude>1</extrude>\n"
"<tesselate>1</tesselate>\n"
"<altitudeMode>absolute</altitudeMode>\n"
"<coordinates> \n")
f.write("%f,%f,%f " % (float(longitude),float(latitude),float(altitude))) 
f.write("\n</coordinates>\n"
"</LineString></Placemark>\n\n"
"</Document></kml>")

f.close() #closes the file

while True: #starts an infinite while loop

    longitude = ser.readline() # reads the longitude data from serial
    latitude = ser.readline() # reads the latitude data from serial
    altitude = ser.readline() # reads the altitude data from serial
    
    ser.flushInput() #flushs the serial moniter

    #counts the number of - symbols in the string longitude and latitude
    countLong = longitude.count('-') 
    countLat = latitude.count('-')

    #sets the index lat to zero so that data can be stored as long as all if statements are met
    indexLat = 0
    indexLong = 0


    if countLong == 1 and countLat == 1:
        indexLong = longitude.index('-')
        indexLat = latitude.index('-')
        countLong = longitude.count('.')
        countLat = latitude.count('.')

    if countLong <= 1 and indexLong <= 0 and countLat <= 1 and indexLat <= 0:

        strLongitude = longitude.replace(" ", "")
        strLatitude = latitude.replace(" ", "")

        floatLong = float(strLongitude)
        floatLat= float(strLatitude)

        changeLong = floatLong - lastLong #calculates the changes in latitude and longitude
        changeLat = floatLat - lastLat

        if changeLong > -1 and changeLong < 1 and changeLat > -1 and changeLat < 1: #ensures that the longitude and latitude have changed only reasonable amounts also meant to stop corrupted data                               
            f = open('entirePath.kml','r+')
            f.seek(-59,2)
            f.write("%f,%f,%f " % (float(longitude),float(latitude),float(altitude)))
            f.seek(-27,2)
            f.write("\n</coordinates>\n"
            "</LineString></Placemark>\n\n"
            "</Document></kml>")

            f.close()

            f = open ('currentLocation.kml','r+')
            f.seek(-92,2)
            f.write("%f,%f,%f " % (float(longitude),float(latitude),float(altitude)))
            f.write("\n</coordinates>\n"
            "</LineString></Placemark>\n\n"
            "</Document></kml>")

            f.close()
        
            lastLong=floatLong
            lastLat=floatLat
