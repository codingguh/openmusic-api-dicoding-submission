const mapDBToModel = ({ 
    id,
    name,
    year,
    // created_at,
    // updated_at,
  }) => ({
    id,
    name,
    year,
    // createdAt: created_at,
    // updatedAt: updated_at,
  });

  const mapDBSongToModel = ({
    id, 
    title, 
    year, 
    performer, 
    genre, 
    duration, 
    album_id,
}) => ({
    id, 
    title, 
    year, 
    performer, 
    genre, 
    duration, 
    albumId : album_id,
});

  module.exports = { mapDBToModel,mapDBSongToModel };