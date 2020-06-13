#!/usr/bin/env ruby

require 'roo'
require 'sqlite3'

gsvns = Hash.new
gspns = Hash.new

if $ARGV.empty?
  puts "Usage: #{$0} <excel file>"
  exit 1
end

###############################################################################

def parse_video_sheet(xls, db)
  # Read in videos file
  video_sheet = xls.sheet(2)
  video_headers = video_sheet.row(1)

  # Clear up videos table
  db.execute("DELETE FROM videos;")

  # Loop through rows
  for row in 2..video_sheet.last_row
    sql  = "INSERT INTO videos (gsvn, video_type, video_id, interface_link, video_title, video_author, video_length) VALUES ("
    sql += "'#{video_sheet.cell(row, 'A')}',"
    sql += "'#{video_sheet.cell(row, 'B').downcase}',"
    sql += "'#{video_sheet.cell(row, 'C')}',"
    sql += "'#{video_sheet.cell(row, 'D')}',"

    if video_sheet.cell(row, 'E')
      sql += "'#{video_sheet.cell(row, 'E').gsub("'","''").strip}',"
    else
      sql += "'',"
    end

    if video_sheet.cell(row, 'F')
      sql += "'#{video_sheet.cell(row, 'F').gsub("'","''").strip}',"
    else
      sql += "'',"
    end

    # If it's an integer, its in seconds
    # If it's longer than a day, its in DateTime
    # From the start of time according to excel
    video_length = video_sheet.cell(row, 'G')
    if video_sheet.cell(row, 'G').class == DateTime
      d_start = DateTime.parse("1899-12-30 00:00:00")
      d_end = video_sheet.cell(row, 'G')
      video_length = ((d_end - d_start) * 24 * 60 * 60).to_i
    end

    if video_length.nil?
      video_length = -1
    end

    sql += "#{video_length}"
    sql += ");"

    # Save in database
    db.execute(sql)
  end
end

###############################################################################

def parse_playlist_sheet(xls, db)
  playlist_sheet = xls.sheet(0)

  # Clean up playlists and cubes table
  db.execute("DELETE FROM playlist;")
  db.execute("DELETE FROM cubes;")

  # Loop through rows
  for row in 2..playlist_sheet.last_row
    sql  = "INSERT INTO playlist (gspn, user_id, description, active) VALUES ("
    sql += "'#{playlist_sheet.cell(row, 'C')}',"
    sql += "'#{playlist_sheet.cell(row, 'A')}',"
    sql += "'#{playlist_sheet.cell(row, 'B').gsub("'","''").strip}',"
    sql += "1"
    sql += ");"

    # Save in database
    db.execute(sql)

    # If there's a cube setting populate cubes
    if playlist_sheet.cell(row, 'D')
      sql = "INSERT INTO cubes (user_id, cube_id, playlist_id) VALUES ("
      sql += "'#{playlist_sheet.cell(row, 'A')}',"
      sql += "'#{playlist_sheet.cell(row, 'D')}',"
      sql += "'#{playlist_sheet.cell(row, 'C')}'"
      sql += ");"

      # Save in database
      db.execute(sql)

    end
  end
end

###############################################################################

def parse_playlist_data_sheet(xls, db, gsvns, gspns)
  playlist_data_sheet = xls.sheet(1)

  # Clean up playlist_data table
  db.execute("DELETE FROM playlist_data;")

  # Loop through rows
  for row in 2..playlist_data_sheet.last_row
    sql = "INSERT INTO playlist_data (playlist_id, playlist_order, video_id) VALUES ("
    sql += "'#{gspns[playlist_data_sheet.cell(row, 'A')]}',"
    sql += "'#{playlist_data_sheet.cell(row, 'B')}',"
    sql += "'#{gsvns[playlist_data_sheet.cell(row, 'C')]}'"
    sql += ");"

    # Save in database
    db.execute(sql)
  end
end

###############################################################################

# Open excel file
xls = Roo::Spreadsheet.open($ARGV[0])

# Open sqlite file
db = SQLite3::Database.new "playlist.db"

# Parse video sheet
parse_video_sheet(xls, db)

# Create a hash of GSVN to IDs
db.execute("SELECT id, gsvn FROM videos").each do |id, gsvn|
  gsvns[gsvn] = id
end

# Get playlists
parse_playlist_sheet(xls, db)

# Create a hash of GSPN to IDs
db.execute("SELECT id, gspn FROM playlist").each do |id, gspn|
  gspns[gspn] = id
end

# Parse playlist data sheet
parse_playlist_data_sheet(xls, db, gsvns, gspns)



